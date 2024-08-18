import { Module } from '@nestjs/common';
import { MemoriesService } from './memories.service';

@Module({
  providers: [MemoriesService],
})
export class MemoriesModule {}
