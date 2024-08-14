import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { User } from './domain/user';
import { UsersRepository } from './repositories/users.repository';
import { UserDto } from './dto/user.dto';
import { ERROR_MESSAGES } from '../utils/constants/all-constants';
import { GetUsersDto } from './dto/getUsers.dto';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    return this.usersRepository.findOne(fields);
  }

  async findOneById(id: string): Promise<UserDto> {
    return this.usersRepository.getUserById(id);
  }

  async getUsers(getUsers: GetUsersDto): Promise<UserDto[]> {
    return this.usersRepository.getUsers(
      getUsers.search,
      getUsers.subscriptionType,
      getUsers.categoryId,
    );
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async blockOrUnblockUser(id: string): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    await this.usersRepository.udpdateUserStatus(id, !user.activated);
  }

  async exportUsersToCsv(getUsers: GetUsersDto): Promise<string> {
    const users = await this.getUsers(getUsers);

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'firstName', title: 'First Name' },
        { id: 'email', title: 'Email' },
      ],
    });

    const records = users.map((user) => ({
      firstName: user.profile?.firstName || '',
      email: user.email,
    }));

    const csvContent =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records);
    return csvContent;
  }
}
