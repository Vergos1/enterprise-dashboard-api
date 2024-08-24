import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PromptType } from '../constants/prompt-type.enun';

export class GetAiPromptDto {
  @ApiProperty({
    description: 'Type of the AI prompt to retrieve',
    enum: PromptType,
    example: PromptType.TagGeneration,
  })
  @IsEnum(PromptType, {
    message: `type must be one of the following values: ${Object.values(PromptType).join(', ')}`,
  })
  type: PromptType;
}
