import { MemoryEntity } from '../entities/memory.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoryStatus } from '../entities/memory.entity';
import { MemoriesListType } from '../constants/memories-list-type.enum';
import { MemoryInListDto } from '../dto/memory-in-list.dto';

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

  async udpdateMemoryStatus(id: string, status: MemoryStatus): Promise<void> {
    await this.memoryEntityRepository.update(id, { status });
  }
}
