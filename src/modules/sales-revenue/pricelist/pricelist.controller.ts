import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import { CreatePricelistDto } from './dto/create-pricelist.dto';
import { UpdatePricelistDto } from './dto/update-pricelist.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('pricelist')
export class PricelistController {
  constructor(private readonly pricelistService: PricelistService) {}

  @Post()
  async create(@Body() createPricelistDto: CreatePricelistDto) {
    try {
      const pricelist = await this.pricelistService.create(
        createPricelistDto,
      );

      return responseService.success(
        pricelist,
        'Pricelist created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create pricelist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const pricelists = await this.pricelistService.findAll();
      return responseService.success(
        pricelists,
        'Pricelists fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch pricelists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const pricelist = await this.pricelistService.findOne(id);
      return responseService.success(
        pricelist,
        'Pricelist fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Pricelist not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePricelistDto: UpdatePricelistDto,
  ) {
    try {
      const pricelist = await this.pricelistService.update(
        id,
        updatePricelistDto,
      );

      return responseService.success(
        pricelist,
        'Pricelist updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update pricelist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.pricelistService.remove(id);
      return responseService.success(
        null,
        'Pricelist deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete pricelist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
