import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { RawMaterialReceiptService } from './raw-material-receipt.service';
import { CreateRawMaterialReceiptDto } from './dto/create-raw-material-receipt.dto';
import { UpdateRawMaterialReceiptDto } from './dto/update-raw-material-receipt.dto';

@Controller('raw-material-receipt')
export class RawMaterialReceiptController {
  constructor(private readonly rawMaterialReceiptService: RawMaterialReceiptService) {}

  @Post()
  create(@Body() createRawMaterialReceiptDto: CreateRawMaterialReceiptDto) {
    return this.rawMaterialReceiptService.createAndPostReceipt(createRawMaterialReceiptDto);
  }

  @Get()
  findAll() {
    return this.rawMaterialReceiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawMaterialReceiptService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRawMaterialReceiptDto: UpdateRawMaterialReceiptDto) {
    return this.rawMaterialReceiptService.update(id, updateRawMaterialReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawMaterialReceiptService.remove(id);
  }
  @Get(':id/generate')
  generateReceipt(@Param('id') id: string,@Res() res: Response) {
    return this.rawMaterialReceiptService.generateReceipt(id,res);
  }
}
