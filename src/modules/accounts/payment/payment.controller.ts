/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto, @Req() req) {
    try {
            const userId = req.user.id; // <-- user ID from JWT payload

      const payment = await this.paymentService.create(createPaymentDto, userId);
      return responseService.success(payment, 'Payment created successfully', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const payments = await this.paymentService.findAll();
      return responseService.success(payments, 'Payments fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch payments',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Get('/settled')
  async paymentSetteled() {
    try {
      const payments = await this.paymentService.paymentSetteled();
      return responseService.success(payments, 'Settled Payments fetched successfully', HttpStatus.OK);
    }
    catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error), 
        'Failed to fetch settled payments',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.paymentService.findOne(id);
      return responseService.success(payment, 'Payment fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch payment',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.paymentService.remove(id);
      return responseService.success(null, 'Payment removed successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to remove payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
