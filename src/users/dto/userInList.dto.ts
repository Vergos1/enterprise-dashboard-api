import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/roles.enum';
import { UserStatus } from '../constants/user-status.enum';
import { SubscriptionType } from '../constants/subscription-type.enum';

export class UserInListDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'The avatar URL of the user',
  })
  avatar: string | null;

  @ApiProperty({
    example: 'User',
    description: 'The role of the user',
    enum: Role,
  })
  role: Role;

  @ApiProperty({
    description: 'The tariff plan of the user',
    example: SubscriptionType.Free,
    enum: SubscriptionType,
  })
  subscriptionType: SubscriptionType;

  @ApiProperty({
    example: 'Active',
    description: 'The status of the user',
    enum: UserStatus,
  })
  status: UserStatus;
}
