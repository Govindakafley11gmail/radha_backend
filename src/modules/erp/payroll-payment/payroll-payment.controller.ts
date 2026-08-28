/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Param, Delete, HttpStatus } from '@nestjs/common';
import { PayrollPaymentService } from './payroll-payment.service';
import { CreatePayrollPaymentDto } from './dto/create-payroll-payment.dto';
import { ResponseService } from 'src/common/response/response';
const responseService = new ResponseService();

@Controller('payroll-payment')
export class PayrollPaymentController {
  constructor(private readonly payrollPaymentService: PayrollPaymentService) {}

  @Post()
 async create(@Body() createPayrollPaymentDto: CreatePayrollPaymentDto) {
    try {
      const payroll = await this.payrollPaymentService.create(createPayrollPaymentDto);
      return responseService.success(payroll, 'Approved Payrolls retrieved successfully', HttpStatus.OK);
    } catch (err: any) {

      return responseService.error(err.message, 'Failed to retrieve payrolls', HttpStatus.BAD_REQUEST);}
  }

  @Get()
  findAll() {
    try {
      const payroll = this.payrollPaymentService.findAll();
      return responseService.success(payroll, 'Approved Payrolls retrieved successfully', HttpStatus.OK);
    } catch (err: any) {
      return responseService.error(err.message, 'Failed to retrieve payrolls', HttpStatus.BAD_REQUEST);}

  }

 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollPaymentService.remove(id);
  }
}
