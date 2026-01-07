/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Post, Body, Patch, Param, Res, Req } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  async create(@Body() createReceiptDto: CreateReceiptDto, @Req() req) {
              const userId = req.user.id; // <-- user ID from JWT payload
    return await this.receiptService.create(createReceiptDto,userId);
  }

  @Get()
  async findAll() {
    return await this.receiptService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.receiptService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReceiptDto: UpdateReceiptDto,
  ) {
    return await this.receiptService.update(id, updateReceiptDto);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    return await this.receiptService.cancelReceipt(id);
  }

  @Get(':id/generate')
  async generateReceipt(@Param('id') id: string, @Res() res: Response) {
    return await this.receiptService.generateReceipt(id, res);
  }
}
