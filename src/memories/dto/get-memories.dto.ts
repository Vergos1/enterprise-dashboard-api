import { ApiProperty } from '@nestjs/swagger';
import { MemoriesListType } from '../constants/memories-list-type.enum';
import { IsEnum } from 'class-validator';
import { PaginationOptionsDTO } from '../../pagination/pagination.options';

export class GetMemoriesDto extends PaginationOptionsDTO {
  @ApiProperty({
    description: 'The type of memories to get',
    enum: MemoriesListType,
    example: MemoriesListType.Unreviewed,
  })
  @IsEnum(MemoriesListType)
  listType: MemoriesListType;
}
