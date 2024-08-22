import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from './roles.enum';
import { ERROR_MESSAGES } from '../utils/constants/all-constants';
import { AppLoggerService } from '../app-logger/app-logger.service';
import { UsersRepository } from '../users/repositories/users-repository/users.repository';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly logger: AppLoggerService,
  ) {}

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  async userHasAdminRole(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    return this.userRepository.userHasRole(user.id, Role.Admin);
  }

  async assignAdminRole(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (user.role === Role.Admin) {
      throw new ForbiddenException(ERROR_MESSAGES.USER_ALREADY_ADMIN);
    }

    await this.userRepository.updateUserRole(user.id, Role.Admin);

    this.logger.log(`Admin role assigned to user ${user.id}.`, 'RolesService');
  }

  async removeAdminRole(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (user.role === Role.User) {
      throw new ForbiddenException(ERROR_MESSAGES.USER_ALREADY_USER);
    }

    await this.userRepository.updateUserRole(user.id, Role.User);

    this.logger.log(`Admin role removed for user ${userId}.`, 'RolesService');
  }
}
