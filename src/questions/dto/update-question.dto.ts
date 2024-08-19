import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateQuestionDto {
  @ApiProperty({
    description: 'The text of the question',
    example: 'What is the capital of France?',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}
