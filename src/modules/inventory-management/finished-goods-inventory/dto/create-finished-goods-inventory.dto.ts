import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFinishedGoodsInventoryDto {
  @IsNotEmpty()
  productType: string;

  @IsNumber()
  quantityOnHand: number;

  @IsNumber()
  value: number;

  @IsNumber()
  damagedQuantity: number;

  @IsNumber()
  writeOffAmount: number;

  @IsNotEmpty()
  productionBatchId: string;

  @IsNotEmpty()
  productUnitCostId: string;
}
