import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { User } from '../../domain/user';
import { UserMapper } from '../../mappers/user.mapper';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IUserRelations } from '../../entities/user.entity';
import { UserDto } from '../../dto/user.dto';
import { Frequency } from '../../entities/preferences.entity';
import { FavoritesFilter } from '../../constants/favorites-filter.enum';
import { UserStatus } from '../../constants/user-status.enum';
import { Role } from '../../../roles/roles.enum';
import { UserInListDto } from '../../dto/userInList.dto';
@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: User): Promise<User> {
    const persistenceModel: UserEntity = UserMapper.toPersistence(data);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  //TODO - change the method to return UserEntity instead of the mapped User. Affects authentication service, user service
  async findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: fields as FindOptionsWhere<UserEntity>,
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  //? - method is added due to the transition from the truth source User to UserEntity. Due to the fact that changes to the findOne method affect existing code
  //? this method is added to maintain compatibility. Ideally, it should be removed after refactoring findOne
  async findById(
    id: string,
    relations: Partial<Record<IUserRelations, boolean>> = null,
  ): Promise<NullableType<UserEntity>> {
    return this.usersRepository.findOne({
      where: { id: id },
      relations,
    });
  }

  async findByEmail(
    email: string,
    relations: Partial<Record<IUserRelations, boolean>> = null,
  ): Promise<NullableType<UserEntity>> {
    return this.usersRepository.findOne({
      where: { email: email },
      relations,
    });
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await this.usersRepository.save(
      this.usersRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async delete(id: User['id']): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async userHasRole(id: string, role: Role): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user.role === role;
  }

  async updateUserRole(id: string, role: Role): Promise<void> {
    await this.usersRepository.update(id, { role: role });
  }

  async getUserById(id: string): Promise<UserDto> {
    const entity = await this.usersRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return entity;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const entity = await this.usersRepository.findOne({
      where: { email },
    });
    if (!entity) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return entity;
  }

  async getUserInfoById(id: string): Promise<UserEntity> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id = :id', { id });

    return queryBuilder.getOne();
  }

  async getVoiceRecordsLength(userId: string): Promise<number> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.memories', 'memories')
      .select('SUM(memories.audioRecordingLength)', 'totalVoiceLength')
      .where('user.id = :userId', { userId });

    const result = await queryBuilder.getRawOne();
    return parseInt(result.totalVoiceLength || '0', 10);
  }

  async udpdateUserStatus(id: string, status: UserStatus): Promise<void> {
    await this.usersRepository.update(id, { status });
  }

  async getQuestionsAmount(userId: string): Promise<number> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.preferences', 'preferences')
      .leftJoin('preferences.inspirations', 'inspirations')
      .select('COUNT(inspirations.id)', 'questionsAmount')
      .where('user.id = :userId', { userId });

    const result = await queryBuilder.getRawOne();
    return parseInt(result.questionsAmount || '0', 10);
  }

  async getUsers(
    search?: string,
    subscriptionType?: Frequency,
    categories?: string[],
    favoritesFilter?: FavoritesFilter,
    status?: UserStatus,
  ): Promise<UserInListDto[]> {
    try {
      const queryBuilder = this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.preferences', 'preferences')
        .leftJoinAndSelect('preferences.inspirations', 'inspirations')
        .leftJoinAndSelect('user.favorites', 'favorites');

      // Search by first name, last name, or email
      if (search) {
        queryBuilder.andWhere(
          '(profile.firstName LIKE :search OR profile.lastName LIKE :search OR user.email LIKE :search)',
          { search: `%${search}%` },
        );
      }

      // Filter by subscription type (checks for any matching frequency)
      if (subscriptionType) {
        queryBuilder.andWhere(
          ':subscriptionType = ANY(preferences.frequency)',
          {
            subscriptionType,
          },
        );
      }

      // Filter by multiple categories (checks if any inspiration category matches)
      if (categories && categories.length > 0) {
        queryBuilder.andWhere('inspirations.categoryId IN (:...categories)', {
          categories,
        });
      }

      // Filter by favorites
      if (favoritesFilter) {
        if (favoritesFilter === FavoritesFilter.Empty) {
          queryBuilder.andWhere('favorites.id IS NULL');
        } else if (favoritesFilter === FavoritesFilter.Include) {
          queryBuilder.andWhere('favorites.id IS NOT NULL');
        }
      }

      // Filter by user status
      if (status) {
        queryBuilder.andWhere('user.status = :status', { status });
      }

      // Order by role: admins first
      queryBuilder.addOrderBy(
        `CASE 
         WHEN user.role = 'admin' THEN 1 
         ELSE 2 
       END`,
        'ASC',
      );

      // Execute query
      const users = await queryBuilder.getMany();

      return users.map((user) => ({
        id: user.id,
        firstName: user.profile?.firstName || null,
        lastName: user.profile?.lastName || null,
        email: user.email,
        avatar: user.profile?.avatar || null,
        role: user.role,
        status: user.status,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('An error occurred while fetching users.');
    }
  }
}
