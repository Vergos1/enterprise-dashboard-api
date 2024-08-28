import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { MemoryStatus } from '../entities/memory.entity';

export class MemoryInListDto {
  @ApiProperty({
    description: 'The ID of the memory',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Status of the memory',
    example: MemoryStatus.Unreviewed,
    enum: MemoryStatus,
  })
  @IsEnum(MemoryStatus)
  status: MemoryStatus;
}
