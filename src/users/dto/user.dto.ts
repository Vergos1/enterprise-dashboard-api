import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsDate,
  ValidateNested,
  IsEnum,
} from 'class-validator';

import { Frequency, WeekDays } from '../entities/preferences.entity';
import { Role } from '../../roles/roles.enum';
import { UserStatus } from '../constants/user-status.enum';
import { TrustedContactDto } from './trustedContact.dto';
import { SubscriptionType } from '../constants/subscription-type.enum';

// Profile DTO
export class ProfileDto {
  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'The birth date of the user',
    example: '1980-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDate()
  birthDate?: Date;
}

// Preferences DTO
export class PreferencesDto {
  @ApiProperty({ description: 'Receive notifications', example: true })
  @IsBoolean()
  receiveNotifications: boolean;

  @ApiProperty({
    description: 'Frequency of notifications',
    example: [Frequency.Weekly],
    enum: Frequency,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(Frequency, { each: true })
  frequency?: Frequency[];

  @ApiProperty({
    description: 'Preferred days of the week',
    example: [WeekDays.Monday],
    enum: WeekDays,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(WeekDays, { each: true })
  weekDays?: WeekDays[];

  @ApiProperty({
    description: 'Preferred time for notifications',
    example: '09:00:00',
  })
  @IsOptional()
  @IsString()
  time?: string;
}

export class UserDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The creation date of the user',
    example: '2022-01-01T00:00:00Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the user',
    example: '2022-01-02T00:00:00Z',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'Indicates if the user is activated',
    example: true,
  })
  @IsBoolean()
  activated: boolean;

  @ApiProperty({
    description: 'The status of the user',
    example: 'Active',
  })
  status: UserStatus;

  @ApiProperty({
    description: 'The role of the user',
    example: 'User',
  })
  role: Role;

  @ApiProperty({
    description: 'The tariff plan of the user',
    example: SubscriptionType.Free,
    enum: SubscriptionType,
  })
  subscriptionType: SubscriptionType;

  @ApiProperty({
    type: ProfileDto,
    description: 'Profile information of the user',
  })
  @ValidateNested()
  profile?: ProfileDto;

  @ApiProperty({
    type: [PreferencesDto],
    description: 'Preferences of the user',
  })
  @ValidateNested({ each: true })
  preferences?: PreferencesDto[];

  @ApiProperty({
    type: TrustedContactDto,
    description: 'Trusted contact of the user',
  })
  @ValidateNested()
  trustedContact?: TrustedContactDto;
}
