import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';
import { TagDto } from '../dto/tag.dto';

export class MemoryDetailsDto {
  @ApiProperty({
    description: 'Memory ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Memory name', example: 'My memory' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Text transcription of the memory',
    example: 'This is my memory',
  })
  @IsString()
  transcription: string;

  @ApiProperty({
    description: 'URLs of memory images',
    isArray: true,
    example: ['https://example.com/image.jpg'],
  })
  @IsArray()
  imagesUrls: string[];

  @ApiProperty({
    description: 'Tags associated with the memory',
    type: [TagDto],
  })
  tags: TagDto[];

  @ApiProperty({
    description: 'Memory author ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Memory author email',
    example: 'example@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Memory author first name', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Memory author last name', example: 'Doe' })
  @IsString()
  lastName: string;
}
