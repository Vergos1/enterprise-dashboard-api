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
import { UserStatus } from '../constants/user-status.enum';
import { TrustedContactDto } from './trustedContact.dto';

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

// Category DTO
export class CategoryForUserInfoDto {
  @ApiProperty({
    description: 'The ID of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Health',
  })
  @IsString()
  name: string;
}

export class UserInfoDto {
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
  firstName: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The status of the user',
    example: 'Active',
  })
  status: UserStatus;

  @ApiProperty({
    description: 'The user subscription plan',
    example: 'Moments',
  })
  plan?: string;

  @ApiProperty({
    description: 'The birth date of the user',
    example: '1980-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @ApiProperty({
    description: 'The users voice records amount',
    example: 0,
  })
  voiceRecordsLength: number;

  @ApiProperty({
    description: 'The users questions amount',
    example: 0,
  })
  questionsAmount: number;

  @ApiProperty({
    description: 'The users categories',
    type: CategoryForUserInfoDto,
  })
  categories: CategoryForUserInfoDto[];

  @ApiProperty({
    type: TrustedContactDto,
    description: 'Trusted contact of the user',
  })
  @ValidateNested()
  trustedContact?: TrustedContactDto;
}
