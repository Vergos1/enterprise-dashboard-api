import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'user_trusted_contacts',
})
export class TrustedContactEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  relation: string;

  @OneToOne(() => UserEntity, (user) => user.trustedContact, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
