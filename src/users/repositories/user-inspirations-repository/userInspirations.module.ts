import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInspirationsEntity } from 'src/users/entities/user-inspiration.entity';
import { UserInspirationsRepository } from './userInspirations.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserInspirationsEntity])],
  providers: [UserInspirationsRepository],
  exports: [UserInspirationsRepository],
})
export class UserInspirationsRepositoryModule {}
