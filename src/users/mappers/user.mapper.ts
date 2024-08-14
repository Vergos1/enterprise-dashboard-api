import { User } from '../domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const user = new User();
    user.id = raw.id;
    user.email = raw.email;
    user.password = raw.password;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    user.firebaseAccountId = raw.firebaseAccountId;
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    user.activated = raw.activated;
    user.emailToken = raw.emailToken;
    user.friends = raw.friends || [];
    return user;
  }

  static toPersistence(user: User): UserEntity {
    const userEntity = new UserEntity();
    if (user.id && typeof user.id === 'string') {
      userEntity.id = user.id;
    }
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    if (user.firebaseAccountId && typeof user.firebaseAccountId === 'string') {
      userEntity.firebaseAccountId = user.firebaseAccountId;
    }
    userEntity.activated = user.activated;
    userEntity.emailToken = user.emailToken;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;
    userEntity.friends = user.friends;

    return userEntity;
  }
}
