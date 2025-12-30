import { PartialType } from '@nestjs/mapped-types';
import { CreateMachineCostDto } from './create-machine-cost.dto';

export class UpdateMachineCostDto extends PartialType(CreateMachineCostDto) {}
