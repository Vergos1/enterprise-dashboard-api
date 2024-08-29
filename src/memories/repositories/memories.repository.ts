import { MemoryEntity } from '../entities/memory.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoryStatus } from '../entities/memory.entity';
import { MemoriesListType } from '../constants/memories-list-type.enum';
import { MemoryInListDto } from '../dto/memory-in-list.dto';
import { MemoryDetailsDto } from '../dto/memory-details.dto';

export class MemoriesRepository {
  constructor(
    @InjectRepository(MemoryEntity)
    private readonly memoryEntityRepository: Repository<MemoryEntity>,
  ) {}
  async findOneById(id: string): Promise<MemoryEntity> {
    return await this.memoryEntityRepository.findOne({ where: { id } });
  }

  async getMemories(listType: MemoriesListType): Promise<MemoryInListDto[]> {
    const queryBuilder = this.memoryEntityRepository
      .createQueryBuilder('memory')
      .leftJoinAndSelect('memory.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile');

    if (listType === MemoriesListType.Reviewed) {
      queryBuilder
        .where('memory.status = :reviewed', { reviewed: MemoryStatus.Reviewed })
        .orWhere('memory.status = :blocked', { blocked: MemoryStatus.Blocked });
    } else if (listType === MemoriesListType.Unreviewed) {
      queryBuilder.where('memory.status = :unreviewed', {
        unreviewed: MemoryStatus.Unreviewed,
      });
    }

    queryBuilder.orderBy('memory.createdAt', 'DESC');

    const memories = await queryBuilder
      .select([
        'memory.id',
        'user.id',
        'user.email',
        'profile.firstName',
        'profile.lastName',
        'memory.status',
      ])
      .getMany();

    return memories.map((memory) => ({
      id: memory.id,
      userId: memory.user.id,
      email: memory.user.email,
      firstName: memory.user.profile?.firstName || null,
      lastName: memory.user.profile?.lastName || null,
      status: memory.status,
    }));
  }

  async getMemoryById(id: string): Promise<MemoryDetailsDto | undefined> {
    const memory = await this.memoryEntityRepository
      .createQueryBuilder('memory')
      .leftJoinAndSelect('memory.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('memory.tags', 'tags')
      .select([
        'memory.id',
        'memory.name',
        'memory.transcription',
        'memory.imagesUrls',
        'memory.status',
        'user.id',
        'user.email',
        'profile.firstName',
        'profile.lastName',
        'tags.id',
        'tags.name',
      ])
      .where('memory.id = :id', { id })
      .getOne();

    if (!memory) {
      return undefined;
    }

    return {
      id: memory.id,
      name: memory.name,
      transcription: memory.transcription,
      imagesUrls: memory.imagesUrls,
      tags: memory.tags.map((tag) => ({ id: tag.id, name: tag.name })),
      userId: memory.user.id,
      email: memory.user.email,
      firstName: memory.user.profile?.firstName || '',
      lastName: memory.user.profile?.lastName || '',
    };
  }

  async udpdateMemoryStatus(id: string, status: MemoryStatus): Promise<void> {
    await this.memoryEntityRepository.update(id, { status });
  }
}
