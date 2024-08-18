import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from '../entities/user.entity';
import { Role } from '../../roles/roles.enum';
import { UserStatus } from '../constants/user-status.enum';

export class User {
  id?: string;

  @Expose({ groups: ['me', 'admin'] })
  email?: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  firstName?: string | null;

  lastName?: string | null;

  firebaseAccountId: string;

  createdAt?: Date;

  updatedAt?: Date;

  activated?: boolean;

  emailToken?: string;

  friends?: UserEntity[];

  status?: UserStatus;

  role?: Role;
}
