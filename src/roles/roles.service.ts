import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/roles.entity';
import { Repository } from 'typeorm';
import { Role } from './roles.enum';
import { UsersService } from '../users/users.service';
import { ERROR_MESSAGES } from 'src/utils/constants/all-constants';
import { AppLoggerService } from '../app-logger/app-logger.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
    private readonly userService: UsersService,
    private readonly logger: AppLoggerService,
  ) {}

  async userHasAdminRole(userId: string): Promise<boolean> {
    const roles = await this.rolesRepository.find({
      where: { users: { id: userId } },
    });
    return roles.some((role) => role.name === Role.Admin);
  }

  async assignAdminRole(userId: string): Promise<void> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    let adminRole = await this.rolesRepository.findOne({
      where: { name: Role.Admin },
    });

    if (!adminRole) {
      adminRole = this.rolesRepository.create({
        name: Role.Admin,
        users: [],
      });
      await this.rolesRepository.save(adminRole);
    }

    if (!adminRole.users.some((u) => u.id === userId)) {
      adminRole.users.push(user);
      await this.rolesRepository.save(adminRole);
      this.logger.log(`Admin role assigned to user ${userId}.`, 'RolesService');
    }
  }

  async removeAdminRole(userId: string): Promise<void> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const adminRole = await this.rolesRepository.findOne({
      where: { name: Role.Admin },
      relations: ['users'],
    });

    if (!adminRole) {
      return;
    }
    adminRole.users = adminRole.users.filter((u) => u.id !== userId);
    await this.rolesRepository.save(adminRole);
    this.logger.log(`Admin role removed from user ${userId}.`, 'RolesService');
  }
}
