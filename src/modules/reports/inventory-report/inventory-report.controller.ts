import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryReportService } from './inventory-report.service';
import { CreateInventoryReportDto } from './dto/create-inventory-report.dto';
import { UpdateInventoryReportDto } from './dto/update-inventory-report.dto';

@Controller('inventory-report')
export class InventoryReportController {
  constructor(private readonly inventoryReportService: InventoryReportService) {}

  @Post()
  create(@Body() createInventoryReportDto: CreateInventoryReportDto) {
    return this.inventoryReportService.create(createInventoryReportDto);
  }
}
