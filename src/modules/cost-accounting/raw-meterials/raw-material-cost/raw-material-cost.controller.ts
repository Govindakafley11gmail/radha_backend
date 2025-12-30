import { Body, Controller, Get, Param, Post, Patch, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateRawMaterialCostDto } from './dto/create-raw-material-cost.dto';
import { UpdateRawMaterialCostDto } from './dto/update-raw-material-cost.dto';
import { RawMaterialCostService } from './raw-material-cost.service';

@Controller('raw-material-cost')
export class RawMaterialCostController {
  constructor(private readonly rawMaterialCostService: RawMaterialCostService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createRawMaterialCostDto: CreateRawMaterialCostDto) {
    return this.rawMaterialCostService.create(createRawMaterialCostDto);
  }

  @Get()
  findAll() {
    return this.rawMaterialCostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawMaterialCostService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id') id: string, @Body() updateRawMaterialCostDto: UpdateRawMaterialCostDto) {
    return this.rawMaterialCostService.update(+id, updateRawMaterialCostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawMaterialCostService.remove(+id);
  }
  
}

