import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty, IsDate } from 'class-validator';
import { CategoryEntity } from 'src/categories/entities/category.entity';

export class QuestionDto {
  @ApiProperty({
    description: 'The unique identifier of the question',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The text content of the question',
    example: 'What motivates you every day?',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'The ID of the associated category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  category: CategoryEntity;

  @ApiProperty({
    description: 'The date when the question was created',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the question was last updated',
    example: '2024-01-02T00:00:00Z',
  })
  @IsDate()
  updatedAt: Date;
}
