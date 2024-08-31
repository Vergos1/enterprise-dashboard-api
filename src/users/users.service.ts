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
import {
  PaginatedList,
  PageMetaData,
  PaginationOptionsDTO,
} from 'src/pagination/pagination.options';

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

  async getUsers(
    getUsers: GetUsersDto,
    id: string,
  ): Promise<PaginatedList<UserInListDto>> {
    const items = await this.usersRepository.getUsers(
      id,
      getUsers.search,
      getUsers.subscriptionType,
      getUsers.categories,
      getUsers.favoritesFilter,
      getUsers.status,
    );

    const paginationOptions = new PaginationOptionsDTO();
    paginationOptions.page = getUsers.page || 1;
    paginationOptions.limit = getUsers.limit || 10;
    const itemCount = items.length;
    const pageMatadata = new PageMetaData({
      itemCount,
      paginationOptionsDTO: paginationOptions,
    });

    return new PaginatedList<UserInListDto>(items, pageMatadata);
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
    const users = await this.usersRepository.getUsersForExport(
      getUsers.search,
      getUsers.subscriptionType,
      getUsers.categories,
      getUsers.favoritesFilter,
      getUsers.status,
    );

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

  async getUserInfoById(id: string): Promise<UserInfoDto> {
    const user = await this.usersRepository.getUserInfoById(id);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const {
      id: userId,
      email,
      status,
      profile,
      trustedContact,
      subscriptionType,
      totalAudioDuration,
      questionsCount,
    } = user;
    const { firstName, lastName, birthDate } = profile;

    // you can use this code to get the total duration of all audio records
    // const totalAudioDuration =
    //   await this.usersRepository.getVoiceRecordsLength(userId);

    // you can use this code to get the total amount of questions
    // const questionsCount =
    //   await this.usersRepository.getQuestionsAmount(userId);

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
      subscriptionType,
      birthDate,
      totalAudioDuration,
      questionsCount,
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
