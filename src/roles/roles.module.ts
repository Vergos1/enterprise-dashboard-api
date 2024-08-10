import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleEntity } from './entities/roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { AppLoggerModule } from 'src/app-logger/app-logger.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity]),
    UsersModule,
    AppLoggerModule,
  ],
  providers: [RolesService],
  exports: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
