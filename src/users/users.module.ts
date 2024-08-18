import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AppLoggerModule } from 'src/app-logger/app-logger.module';
import { UsersRepositoryModule } from './repositories/users-repository/users.repository.module';
import { UserInspirationsRepositoryModule } from './repositories/user-inspirations-repository/userInspirations.module';
import { CategoriesRepositoryModule } from 'src/categories/repositories/categories.repository.module';

@Module({
  imports: [
    UsersRepositoryModule,
    UserInspirationsRepositoryModule,
    CategoriesRepositoryModule,
    AppLoggerModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
