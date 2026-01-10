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
import { SalesReturnService } from './sales-return.service';
import { CreateSalesReturnDto } from './dto/create-sales-return.dto';
import { UpdateSalesReturnDto } from './dto/update-sales-return.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('sales-return')
export class SalesReturnController {
  constructor(
    private readonly salesReturnService: SalesReturnService,
  ) {}

  @Post()
  async create(@Body() dto: CreateSalesReturnDto) {
    try {
      const salesReturn = await this.salesReturnService.create(dto);
      return responseService.success(
        salesReturn,
        'Sales return created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create sales return',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const salesReturns = await this.salesReturnService.findAll();
      return responseService.success(
        salesReturns,
        'Sales returns fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch sales returns',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const salesReturn = await this.salesReturnService.findOne(id);
      return responseService.success(
        salesReturn,
        'Sales return fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Sales return not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSalesReturnDto,
  ) {
    try {
      const salesReturn = await this.salesReturnService.update(id, dto);
      return responseService.success(
        salesReturn,
        'Sales return updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update sales return',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.salesReturnService.remove(id);
      return responseService.success(
        null,
        'Sales return deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete sales return',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
