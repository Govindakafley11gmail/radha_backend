import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAccountGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
