import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Frequency } from '../entities/preferences.entity';
import { FavoritesFilter } from '../constants/favorites-filter.enum';
import { UserStatus } from '../constants/user-status.enum';

export class GetUsersDto {
  @ApiPropertyOptional({
    description: 'Search by first name, last name, or email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by subscription type',
    enum: Frequency,
  })
  @IsOptional()
  @IsEnum(Frequency, {
    message: `subscription Type must be one of the following values: ${Object.values(Frequency).join(', ')}`,
  })
  subscriptionType?: Frequency;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by favorites status: all, empty, include',
    enum: FavoritesFilter,
  })
  @IsOptional()
  @IsEnum(FavoritesFilter, {
    message: `Favorites Filter must be one of the following values: ${Object.values(FavoritesFilter).join(', ')}`,
  })
  favoritesFilter?: FavoritesFilter;

  @ApiPropertyOptional({
    description: 'Filter by user status: Active, Blocked, Inactive',
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus, {
    message: `User status must be one of the following values: ${Object.values(UserStatus).join(', ')}`,
  })
  status?: UserStatus;
}
