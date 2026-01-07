import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateDispatchDto {
  @IsDateString()
  dispatchDate: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  @IsString()
  service?: string;
}
