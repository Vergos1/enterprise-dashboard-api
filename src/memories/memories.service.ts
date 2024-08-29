import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoriesRepository } from './repositories/memories.repository';
import { MemoryStatus } from './entities/memory.entity';
import { MemoryEntity } from './entities/memory.entity';
import { ERROR_MESSAGES } from '../utils/constants/all-constants';
import { MemoryInListDto } from './dto/memory-in-list.dto';
import { GetMemoriesDto } from './dto/get-memories.dto';
import { MemoryDetailsDto } from './dto/memory-details.dto';
import {
  PaginatedList,
  PageMetaData,
  PaginationOptionsDTO,
} from '../pagination/pagination.options';

@Injectable()
export class MemoriesService {
  constructor(private readonly memoriesRepository: MemoriesRepository) {}

  async findOneById(id: string): Promise<MemoryEntity> {
    return this.memoriesRepository.findOneById(id);
  }

  async getMemoryById(id: string): Promise<MemoryDetailsDto> {
    const memory = await this.memoriesRepository.getMemoryById(id);

    if (!memory) {
      throw new NotFoundException(ERROR_MESSAGES.MEMORY_NOT_FOUND);
    }

    return memory;
  }

  async getMemories(
    getMemories: GetMemoriesDto,
  ): Promise<PaginatedList<MemoryInListDto>> {
    const items = await this.memoriesRepository.getMemories(
      getMemories.listType,
    );

    const paginationOptions = new PaginationOptionsDTO();
    paginationOptions.page = getMemories.page || 1;
    paginationOptions.limit = getMemories.limit || 10;
    const itemCount = items.length;
    const pageMatadata = new PageMetaData({
      itemCount,
      paginationOptionsDTO: paginationOptions,
    });

    return new PaginatedList<MemoryInListDto>(items, pageMatadata);
  }

  async changeStatus(id: string, status: MemoryStatus): Promise<void> {
    const memory = await this.findOneById(id);
    if (!memory) {
      throw new NotFoundException(ERROR_MESSAGES.MEMORY_NOT_FOUND);
    }

    await this.memoriesRepository.udpdateMemoryStatus(memory.id, status);
  }
}
