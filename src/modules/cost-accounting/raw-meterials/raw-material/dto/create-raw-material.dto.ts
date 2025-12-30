import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateRawMaterialDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    unit: string; // e.g., kg, liters, pieces

    @IsNotEmpty()
    @IsNumber()
    standard_cost: number;

    @IsOptional()
    @IsString()
    description?: string; // optional field

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

}
