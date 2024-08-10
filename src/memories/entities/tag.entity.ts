import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MemoryEntity } from './memory.entity';

@Entity({ name: 'tags' })
export class TagEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => MemoryEntity, (memory: MemoryEntity) => memory.tags, {
    onDelete: 'NO ACTION',
  })
  memories: MemoryEntity[];
}
