import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { QuestionDto } from 'src/questions/dto/question.dto';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryDto {
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
  @IsUUID()
  parentCategory: CategoryEntity | null;

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
    type: [CategoryDto],
    required: false,
  })
  subcategories: CategoryEntity[];

  @ApiProperty({
    description: 'The questions associated with this category',
    type: [QuestionDto],
    required: false,
  })
  questions: QuestionDto[];
}
