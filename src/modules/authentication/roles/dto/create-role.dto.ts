import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayUnique, IsNumber } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  @IsOptional()
  permissionIds?: number[]; // array of permission IDs to assign to this role
}
