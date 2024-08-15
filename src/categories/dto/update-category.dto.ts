import { IsOptional, IsString, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Technology',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The UUID of the parent category (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentCategoryId?: string;

  @ApiProperty({
    description: 'List of subcategory UUIDs (optional)',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  subcategoryIds?: string[];
}
