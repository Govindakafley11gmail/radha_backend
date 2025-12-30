import { PartialType } from '@nestjs/mapped-types';
import { CreateRawMaterialReceiptDto } from './create-raw-material-receipt.dto';

export class UpdateRawMaterialReceiptDto extends PartialType(CreateRawMaterialReceiptDto) {}
