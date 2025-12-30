import { PartialType } from '@nestjs/mapped-types';
import { CreateOtherProductionCostDto } from './create-other-production-cost.dto';

export class UpdateOtherProductionCostDto extends PartialType(CreateOtherProductionCostDto) {}
