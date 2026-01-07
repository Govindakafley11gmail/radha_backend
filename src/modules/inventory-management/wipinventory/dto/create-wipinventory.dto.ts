import {  IsNumber, Min, IsString } from "class-validator";

export class CreateWipinventoryDto {
     @IsString()
  batchId: string; // reference to ProductionBatch

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  cost: number;
}
