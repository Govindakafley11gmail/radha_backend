import { PartialType } from '@nestjs/mapped-types';
import { CreateRawMaterialInventoryDto } from './create-raw-material-inventory.dto';

export class UpdateRawMaterialInventoryDto extends PartialType(CreateRawMaterialInventoryDto) {}
