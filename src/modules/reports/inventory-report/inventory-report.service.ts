import { Injectable } from '@nestjs/common';
import { CreateInventoryReportDto } from './dto/create-inventory-report.dto';
import { UpdateInventoryReportDto } from './dto/update-inventory-report.dto';
import { find } from 'rxjs';

@Injectable()
export class InventoryReportService {
  create(createInventoryReportDto: CreateInventoryReportDto) {

 
  }

}
