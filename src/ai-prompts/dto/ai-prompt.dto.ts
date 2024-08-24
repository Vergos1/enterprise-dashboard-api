import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PromptType } from '../constants/prompt-type.enun';

export class AiPromptDto {
  @ApiProperty({
    description: 'Unique identifier for the AI prompt',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Type of the AI prompt',
    enum: PromptType,
    example: PromptType.TagGeneration,
  })
  @IsEnum(PromptType)
  type: PromptType;

  @ApiProperty({
    description: 'Prompt text used by AI',
    example: 'Generate the 5 most relevant tags for the following text...',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
