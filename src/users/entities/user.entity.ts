import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { MemoryEntity } from '../../memories/entities/memory.entity';
import { ProfileEntity } from './profile.entity';
import { PreferencesEntity } from './preferences.entity';
import { TrustedContactEntity } from './trusted-contacts.entity';
import { Exclude } from 'class-transformer';

export type IUserRelations =
  | 'friends'
  | 'memories'
  | 'favorites'
  | 'sharedMemories';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Exclude()
  @Column({ unique: true, nullable: false, name: 'firebase_account_id' })
  firebaseAccountId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ nullable: false, default: false })
  activated: boolean;

  @Exclude()
  @Column({ nullable: true, default: '' })
  emailToken: string;

  @OneToMany(() => MemoryEntity, (memory) => memory.user, {
    onDelete: 'CASCADE',
  })
  memories?: MemoryEntity[];

  @ManyToMany(() => MemoryEntity, (memory) => memory.favoriteBy, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'user_favorites_memory',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'memory_id',
      referencedColumnName: 'id',
    },
  })
  favorites?: MemoryEntity[];

  @ManyToMany(() => UserEntity, (user) => user.friends, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'friends',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friend_id',
      referencedColumnName: 'id',
    },
  })
  friends?: UserEntity[];

  @ManyToMany(() => MemoryEntity, (memory) => memory.sharedWith, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'shared_memories',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'memory_id',
      referencedColumnName: 'id',
    },
  })
  sharedMemories?: MemoryEntity[];

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;

  @OneToMany(() => PreferencesEntity, (preferences) => preferences.user)
  preferences: PreferencesEntity[];

  @OneToOne(() => TrustedContactEntity, (trustedContact) => trustedContact.user)
  trustedContact: ProfileEntity;
}
