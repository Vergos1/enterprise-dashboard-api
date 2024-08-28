import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FavoritesFilter } from '../constants/favorites-filter.enum';
import { UserStatus } from '../constants/user-status.enum';
import { SubscriptionType } from '../constants/subscription-type.enum';
import { PaginationOptionsDTO } from 'src/pagination/pagination.options';

export class GetUsersDto extends PaginationOptionsDTO {
  @ApiPropertyOptional({
    description: 'Search by first name, last name, or email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by subscription type',
    enum: SubscriptionType,
  })
  @IsOptional()
  @IsEnum(SubscriptionType, {
    message: `subscription Type must be one of the following values: ${Object.values(SubscriptionType).join(', ')}`,
  })
  subscriptionType?: SubscriptionType;

  @ApiPropertyOptional({
    description: 'Filter by an array of category IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  categories?: string[];

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
