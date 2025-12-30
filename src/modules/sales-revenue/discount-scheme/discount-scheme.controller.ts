import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiscountSchemeService } from './discount-scheme.service';
import { CreateDiscountSchemeDto } from './dto/create-discount-scheme.dto';
import { UpdateDiscountSchemeDto } from './dto/update-discount-scheme.dto';

@Controller('discount-scheme')
export class DiscountSchemeController {
  constructor(private readonly discountSchemeService: DiscountSchemeService) {}

  @Post()
  create(@Body() createDiscountSchemeDto: CreateDiscountSchemeDto) {
    return this.discountSchemeService.create(createDiscountSchemeDto);
  }

  @Get()
  findAll() {
    return this.discountSchemeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountSchemeService.findOne(id); // ✅ keep as string
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscountSchemeDto: UpdateDiscountSchemeDto,
  ) {
    return this.discountSchemeService.update(id, updateDiscountSchemeDto); // ✅ keep as string
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountSchemeService.remove(id); // ✅ keep as string
  }
}
