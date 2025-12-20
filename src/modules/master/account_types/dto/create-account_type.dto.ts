import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateAccountTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  groupId: string; // Link to AccountGroup
}
