import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsNumber()
  page!: number;

  @Type(() => Number)
  @IsNumber()
  pageSize!: number;
}
