import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const VALID_STATUSES = ['Alive', 'Dead', 'unknown'] as const;
const SORTABLE_FIELDS = ['id', 'name', 'status', 'species'] as const;
const SORT_ORDERS = ['asc', 'desc'] as const;

export class FindCharactersQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Filtro por nombre (contains, case-insensitive)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: VALID_STATUSES })
  @IsOptional()
  @IsIn(VALID_STATUSES)
  status?: (typeof VALID_STATUSES)[number];

  @ApiPropertyOptional({ enum: SORTABLE_FIELDS, default: 'id' })
  @IsOptional()
  @IsIn(SORTABLE_FIELDS)
  sortBy?: (typeof SORTABLE_FIELDS)[number] = 'id';

  @ApiPropertyOptional({ enum: SORT_ORDERS, default: 'asc' })
  @IsOptional()
  @IsIn(SORT_ORDERS)
  order?: (typeof SORT_ORDERS)[number] = 'asc';
}
