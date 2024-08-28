import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Type } from '@nestjs/common';

export class PaginationOptionsDTO {
  @ApiPropertyOptional({
    description: 'The sort order',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description: 'The page number',
    type: Number,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({
    description: 'The number of items per page',
    type: Number,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsInt()
  @Max(100)
  limit?: number;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export interface PageMetaDtoParameters {
  itemCount: number;
  paginationOptionsDTO: PaginationOptionsDTO;
}

export class PageMetaData {
  @ApiProperty({
    description: 'The current page number',
    example: 1,
    default: 1,
  })
  readonly page: number;

  @ApiProperty({
    description: 'The number of items per page',
    example: 10,
    default: 10,
  })
  readonly limit: number;

  @ApiProperty({
    description: 'The total number of items',
    example: 100,
  })
  readonly itemCount: number;

  @ApiProperty({
    description: 'The total number of pages',
    example: 10,
  })
  readonly pageCount: number;

  @ApiProperty({
    description: 'Indicates if there is a previous page',
    example: true,
  })
  readonly hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Indicates if there is a next page',
    example: true,
  })
  readonly hasNextPage: boolean;

  constructor({ itemCount, paginationOptionsDTO }: PageMetaDtoParameters) {
    this.page = paginationOptionsDTO.page || 1;
    this.limit = paginationOptionsDTO.limit || 10;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PaginatedList<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaData })
  readonly meta: PageMetaData;

  constructor(data: T[], meta: PageMetaData) {
    this.data = data;
    this.meta = meta;
  }
}

export function CreatePaginatedDto<T>(
  ItemType: Type<T>,
  className: string,
): Type<PaginatedList<T>> {
  class PaginatedResponseDto extends PaginatedList<T> {
    @ApiProperty({ type: [ItemType] })
    readonly data: T[];
  }

  Object.defineProperty(PaginatedResponseDto, 'name', { value: className });

  return PaginatedResponseDto;
}
