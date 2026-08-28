import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryReportDto } from './create-inventory-report.dto';

export class UpdateInventoryReportDto extends PartialType(CreateInventoryReportDto) {}
