import { PartialType } from '@nestjs/mapped-types';
import { CreateWipinventoryDto } from './create-wipinventory.dto';

export class UpdateWipinventoryDto extends PartialType(CreateWipinventoryDto) {}
