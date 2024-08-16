import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { User } from './domain/user';
import { UsersRepository } from './repositories/users.repository';
import { UserDto } from './dto/user.dto';
import { ERROR_MESSAGES } from '../utils/constants/all-constants';
import { GetUsersDto } from './dto/getUsers.dto';
import { createObjectCsvStringifier } from 'csv-writer';
import { UserStatus } from './constants/user-status.enum';
import { UserInListDto } from './dto/userInList.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    return this.usersRepository.findOne(fields);
  }

  async findOneById(id: string): Promise<UserDto> {
    return this.usersRepository.getUserById(id);
  }

  async getUsers(getUsers: GetUsersDto): Promise<UserInListDto[]> {
    return this.usersRepository.getUsers(
      getUsers.search,
      getUsers.subscriptionType,
      getUsers.categories,
      getUsers.favoritesFilter,
      getUsers.status,
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
    const newUserStatus: UserStatus =
      user.status === UserStatus.Blocked
        ? UserStatus.Active
        : UserStatus.Blocked;
    await this.usersRepository.udpdateUserStatus(id, newUserStatus);
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
      firstName: user.firstName || '',
      email: user.email,
    }));

    const csvContent =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records);
    return csvContent;
  }
}
