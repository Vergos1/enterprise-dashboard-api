import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'The text of the question',
    example: 'What is the capital of France?',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The ID of the category to which the question belongs',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  categoryId: string;
}
