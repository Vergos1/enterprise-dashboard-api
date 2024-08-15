import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { AppLoggerModule } from 'src/app-logger/app-logger.module';
import { UsersRepositoryModule } from 'src/users/repositories/users.repository.module';

@Module({
  imports: [UsersRepositoryModule, AppLoggerModule],
  providers: [RolesService],
  exports: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
