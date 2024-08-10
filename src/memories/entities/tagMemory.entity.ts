import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemoryEntity } from './memory.entity';
import { TagEntity } from './tag.entity';

@Entity('tag_memory')
export class UserFavoriteMemoryEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: string;

  @PrimaryColumn({ name: 'memory_id' })
  memoryId: string;

  @ManyToOne(() => TagEntity, (tag) => tag.memories, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  tags: TagEntity[];

  @ManyToOne(() => MemoryEntity, (memory) => memory.favoriteBy, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'memory_id', referencedColumnName: 'id' }])
  memories: MemoryEntity[];
}
