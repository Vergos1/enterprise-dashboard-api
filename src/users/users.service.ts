import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { User } from './domain/user';
import { UsersRepository } from './repositories/users-repository/users.repository';
import { UserDto } from './dto/user.dto';
import { ERROR_MESSAGES } from '../utils/constants/all-constants';
import { GetUsersDto } from './dto/getUsers.dto';
import { createObjectCsvStringifier } from 'csv-writer';
import { UserStatus } from './constants/user-status.enum';
import { UserInListDto } from './dto/userInList.dto';
import { UserInfoDto } from './dto/userInfo.dto';
import { UserInspirationsRepository } from './repositories/user-inspirations-repository/userInspirations.repository';
import { CategoriesRepository } from '../categories/repositories/categories.repository';
import { UserEntity } from './entities/user.entity';
import { ShortUserInfoDto } from 'src/auth/dto/auth-res.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userInspirationsRepository: UserInspirationsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    return this.usersRepository.findOne(fields);
  }

  async findOneById(id: string): Promise<UserDto> {
    return this.usersRepository.getUserById(id);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.getUserByEmail(email);
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

  async getUserInfoById(id: string): Promise<UserInfoDto> {
    const user = await this.usersRepository.getUserInfoById(id);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const { id: userId, email, status, profile, trustedContact } = user;
    const { firstName, lastName, birthDate } = profile;

    const voiceRecordsLength =
      await this.usersRepository.getVoiceRecordsLength(userId);

    const questionsAmount =
      await this.usersRepository.getQuestionsAmount(userId);

    const categoriesIds =
      await this.userInspirationsRepository.getUserCategoriesIds(userId);
    const categiories =
      await this.categoriesRepository.getCategoriesByIds(categoriesIds);

    return {
      id,
      email,
      firstName,
      lastName,
      status,
      birthDate,
      voiceRecordsLength,
      questionsAmount,
      categories: categiories.map((category) => {
        return { id: category.id, name: category.name };
      }),
      trustedContact,
    };
  }

  async getUserShortInfoById(id: string): Promise<ShortUserInfoDto> {
    const user = await this.usersRepository.getUserInfoById(id);

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const { profile, email } = user;

    return {
      email: email || '',
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
    };
  }
}
