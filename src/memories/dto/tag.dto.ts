import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class TagDto {
  @ApiProperty({
    description: 'Tag ID',
    example: 'c7a3e9f6-4e9a-4e3d-9a2b-8e9b4a1b2c3d',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Tag name', example: 'example tag' })
  @IsString()
  name: string;
}
