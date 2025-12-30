import { PartialType } from '@nestjs/mapped-types';
import { CreateRawMaterialCostDto } from './create-raw-material-cost.dto';

export class UpdateRawMaterialCostDto extends PartialType(CreateRawMaterialCostDto) {}
