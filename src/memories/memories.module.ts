import { Module } from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { MemoriesController } from './memories.controller';
import { MemoriesRepositoryModule } from './repositories/memories.repository.module';

@Module({
  imports: [MemoriesRepositoryModule],
  providers: [MemoriesService],
  controllers: [MemoriesController],
})
export class MemoriesModule {}
