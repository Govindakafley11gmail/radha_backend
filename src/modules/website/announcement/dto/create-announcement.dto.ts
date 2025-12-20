export class CreateAnnouncementDto {
  title: string;
  description: string;
  isActive?: boolean;
}

import { IsOptional, IsInt, Min, IsString, IsBooleanString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationFilterAnnouncementDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
