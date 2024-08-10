import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { TagEntity } from './tag.entity';

export type IMemoryRelations = 'sharedWith';

@Entity({
  name: 'memory',
})
export class MemoryEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ nullable: false, default: '' })
  name: string;

  @Column({ nullable: true })
  transcription: string;

  @Column('simple-array', { nullable: true })
  imagesUrls: string[];

  @Column({ nullable: true })
  audioUrl: string;

  @Column({ nullable: true })
  audioRecordingLength: number;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  date: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.memories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.favorites, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  favoriteBy: UserEntity[];

  @ManyToMany(() => TagEntity, (tag) => tag.memories, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinTable({
    name: 'tag_memory',
    joinColumn: {
      name: 'memory_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags?: TagEntity[];
  @ManyToMany(() => UserEntity, (user) => user.sharedMemories, {
    onDelete: 'CASCADE',
  })
  sharedWith: UserEntity[];
}
