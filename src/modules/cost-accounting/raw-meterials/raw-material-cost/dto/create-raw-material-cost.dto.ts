import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRawMaterialCostDto {
  @IsNotEmpty()
  @IsNumber()
  raw_material_id: number;

//   @IsNotEmpty()
//   @IsNumber()
//   batch_id: number;

  @IsNotEmpty()
  @IsNumber()
  used_quantity: number;

  @IsNotEmpty()
  @IsNumber()
  cost_amount: number; // typically calculated as used_quantity * unit cost

  @IsOptional()
  @IsNumber()
  receipt_id?: number; // optional, if you want to link to a specific RawMaterialReceipt
}
