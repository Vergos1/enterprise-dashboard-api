import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryEntity } from '../entities/memory.entity';
import { MemoriesRepository } from './memories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MemoryEntity])],
  providers: [MemoriesRepository],
  exports: [MemoriesRepository],
})
export class MemoriesRepositoryModule {}
