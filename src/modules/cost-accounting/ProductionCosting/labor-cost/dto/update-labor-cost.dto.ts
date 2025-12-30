import { PartialType } from '@nestjs/mapped-types';
import { CreateLaborCostDto } from './create-labor-cost.dto';

export class UpdateLaborCostDto extends PartialType(CreateLaborCostDto) {}
