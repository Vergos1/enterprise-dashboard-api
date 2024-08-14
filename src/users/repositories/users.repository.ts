import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../domain/user';
import { UserMapper } from '../mappers/user.mapper';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { NullableType } from '../../utils/types/nullable.type';
import { IUserRelations } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';
import { Frequency } from '../entities/preferences.entity';

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

  async getUserById(id: string): Promise<UserDto> {
    const entity = await this.usersRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return entity;
  }

  async udpdateUserStatus(id: string, active: boolean): Promise<void> {
    await this.usersRepository.update(id, { activated: active });
  }

  async getUsers(
    search?: string,
    subscriptionType?: Frequency,
    categoryId?: string,
  ): Promise<UserEntity[]> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.preferences', 'preferences')
      .leftJoinAndSelect('preferences.inspirations', 'inspirations');

    if (search) {
      queryBuilder.andWhere(
        'profile.firstName LIKE :search OR profile.lastName LIKE :search OR user.email LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (subscriptionType) {
      queryBuilder.andWhere(':subscriptionType = ANY(preferences.frequency)', {
        subscriptionType,
      });
    }

    if (categoryId) {
      queryBuilder.andWhere('inspirations.categoryId = :categoryId', {
        categoryId,
      });
    }

    return queryBuilder.getMany();
  }
}
