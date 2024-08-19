import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CategoryInListDto {
  @ApiProperty({
    description: 'Unique identifier of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Technology',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Optional ID of the parent category for subcategories',
    example: '456e7890-e89b-12d3-a456-426614174111',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentCategoryId?: string;

  @ApiProperty({
    description: 'Timestamp when the category was created',
    example: '2024-08-13T08:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the category was last updated',
    example: '2024-08-14T08:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Array of subcategories',
    type: [CategoryInListDto],
    required: false,
  })
  @IsOptional()
  subcategories?: CategoryInListDto[];
}
