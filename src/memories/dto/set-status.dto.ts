import { IsEnum } from 'class-validator';
import { MemoryStatus } from '../entities/memory.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SetStatusDto {
  @ApiProperty({
    description: 'The status of the memory',
    enum: MemoryStatus,
    example: MemoryStatus.Blocked,
  })
  @IsEnum(MemoryStatus)
  status: MemoryStatus;
}
