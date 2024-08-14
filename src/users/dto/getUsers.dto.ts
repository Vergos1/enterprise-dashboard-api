import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Frequency } from '../entities/preferences.entity';

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
}
