import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Role as RoleEnum } from '../roles.enum';

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.Guest,
  })
  name: RoleEnum;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];
}
