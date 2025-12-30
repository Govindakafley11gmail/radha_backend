import { Controller, Get, Body, Param, Delete } from '@nestjs/common';
import { PurchaseinvoicedetailsService } from './purchaseinvoicedetails.service';
// import { UpdatePurchaseinvoicedetailDto } from './dto/update-purchaseinvoicedetail.dto';
// import { CreatePurchaseInvoiceDetailDto } from '../purchase-invoice/dto/create-purchase-invoice.dto';

@Controller('purchaseinvoicedetails')
export class PurchaseinvoicedetailsController {
  constructor(private readonly purchaseinvoicedetailsService: PurchaseinvoicedetailsService) {}

  // @Post()
  // create(@Body() createPurchaseinvoicedetailDto: CreatePurchaseInvoiceDetailDto) {
  //   return this.purchaseinvoicedetailsService.create(createPurchaseinvoicedetailDto);
  // }

  @Get()
  findAll() {
    return this.purchaseinvoicedetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseinvoicedetailsService.findOne(id);
  }

 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseinvoicedetailsService.remove(id);
  }
}
