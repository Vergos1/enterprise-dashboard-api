import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AppLoggerModule } from 'src/app-logger/app-logger.module';
import { UsersRepositoryModule } from './repositories/users.repository.module';

@Module({
  imports: [UsersRepositoryModule, AppLoggerModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
