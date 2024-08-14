import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../domain/user';
import { UserMapper } from '../mappers/user.mapper';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { NullableType } from '../../utils/types/nullable.type';
import { IUserRelations } from '../entities/user.entity';

@Injectable()
export class ProfilesRepository {
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
}
