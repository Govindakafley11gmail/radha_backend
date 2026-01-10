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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.customerService.create(createCustomerDto);
      return responseService.success(
        customer,
        'Customer created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create customer',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const customers = await this.customerService.findAll();
      return responseService.success(
        customers,
        'Customers fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch customers',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const customer = await this.customerService.findOne(id);
      return responseService.success(
        customer,
        'Customer fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch customer',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    try {
      const customer = await this.customerService.update(
        id,
        updateCustomerDto,
      );
      return responseService.success(
        customer,
        'Customer updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update customer',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.customerService.remove(id);
      return responseService.success(
        null,
        'Customer deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete customer',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
