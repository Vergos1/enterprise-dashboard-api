import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { MemoryEntity } from './memory.entity';

@Entity('user_favorites_memory')
export class UserFavoriteMemoryEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'memory_id' })
  memoryId: string;

  @ManyToOne(() => UserEntity, (user) => user.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: UserEntity[];

  @ManyToOne(() => MemoryEntity, (memory) => memory.favoriteBy, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'memory_id', referencedColumnName: 'id' }])
  memories: MemoryEntity[];
}
