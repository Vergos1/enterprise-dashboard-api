import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

type Order = 'ASC' | 'DESC';

export class PaginationOptionsDTO {
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  readonly order?: Order = 'DESC';
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly page?: number = 1;
  @IsInt()
  @IsOptional()
  @Max(100)
  readonly limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export interface PageMetaDtoParameters {
  itemCount: number;
  paginationOptionsDTO: PaginationOptionsDTO;
}

export class PageMetaData {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ itemCount, paginationOptionsDTO }: PageMetaDtoParameters) {
    this.page = paginationOptionsDTO.page;
    this.limit = paginationOptionsDTO.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PaginatedEntity<T> {
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
