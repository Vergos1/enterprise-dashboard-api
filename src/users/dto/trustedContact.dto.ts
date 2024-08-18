import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class TrustedContactDto {
  @ApiProperty({
    description: 'The ID of the trusted contact',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The name of the trusted contact',
    example: 'Jane Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the trusted contact',
    example: 'trusted@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The relationship with the user',
    example: 'Friend',
  })
  @IsOptional()
  @IsString()
  relation?: string;
}
