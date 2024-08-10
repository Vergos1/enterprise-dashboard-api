import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async update(
    id: string,
    updateUserDto: Partial<UserEntity>,
  ): Promise<UserEntity> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
