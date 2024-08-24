import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PromptType } from '../constants/prompt-type.enun';

export class CreateAiPromptDto {
  @ApiProperty({
    description: 'Type of the AI prompt',
    enum: PromptType,
  })
  @IsEnum(PromptType, {
    message: `Type must be one of the following values: ${Object.values(PromptType).join(', ')}`,
  })
  type: PromptType;

  @ApiProperty({
    description: 'The AI prompt text',
    example: 'Generate the 5 most relevant tags for the following text...',
  })
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
