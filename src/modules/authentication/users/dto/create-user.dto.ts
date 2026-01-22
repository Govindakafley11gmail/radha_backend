import { IsString, IsEmail, IsNotEmpty, IsOptional, IsArray, ArrayUnique, IsNumber, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  @IsOptional()
  roleIds?: number[];

  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  @IsOptional()
  permissionIds?: number[];
}
