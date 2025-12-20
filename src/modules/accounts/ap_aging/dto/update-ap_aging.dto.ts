import { PartialType } from '@nestjs/mapped-types';
import { CreateApAgingDto } from './create-ap_aging.dto';

export class UpdateApAgingDto extends PartialType(CreateApAgingDto) {}
