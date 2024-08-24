import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAiPromptDto {
  @ApiProperty({
    description: 'The AI prompt text',
    example: 'Generate the 5 most relevant tags for the following text...',
  })
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
