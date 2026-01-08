/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Param, Patch, HttpStatus, Req } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { ResponseService } from 'src/common/response/response';
import express from 'express';

const responseService = new ResponseService();
interface AuthRequest extends express.Request {
  user: {
    id: number;
    role: string;
  };
}
@Controller('payrolls')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  async create(@Body() dto: CreatePayrollDto) {
    try {
      const payroll = await this.payrollService.create(dto);
      return responseService.success(payroll, 'Payroll created successfully', HttpStatus.CREATED);
    } catch (err) {
      return responseService.error(err.message, 'Failed to create payroll', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const payrolls = await this.payrollService.findAll();
      return responseService.success(payrolls, 'Payrolls retrieved successfully', HttpStatus.OK);
    } catch (err) {
      return responseService.error(err.message, 'Failed to retrieve payrolls', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const payroll = await this.payrollService.findOne(id);
      return responseService.success(payroll, 'Payroll retrieved successfully', HttpStatus.OK);
    } catch (err) {
      return responseService.error(err.message, 'Payroll not found', HttpStatus.NOT_FOUND);
    }
  }

  // Workflow endpoints
  @Patch(':id/submit')
  async submit(@Param('id') id: string) {
    try {
      const payroll = await this.payrollService.submitForApproval(id);
      return responseService.success(payroll, 'Payroll submitted successfully', HttpStatus.OK);
    } catch (err) {
      return responseService.error(err.message, 'Failed to submit payroll', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string, @Req() req: AuthRequest) {
    try {
      const payroll = await this.payrollService.approve(id, req.user.id);
      return responseService.success(payroll, 'Payroll approved successfully', HttpStatus.OK);
    } catch (err) {
      return responseService.error(err.message, 'Failed to approve payroll', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string, @Req() req: AuthRequest, @Body('remarks') remarks: string) {
    try {
      const payroll = await this.payrollService.reject(id, req.user.id, remarks);
      return responseService.success(payroll, 'Payroll rejected successfully', HttpStatus.OK);
    } catch (err) {
      return responseService.error(err.message, 'Failed to reject payroll', HttpStatus.BAD_REQUEST);
    }
  }
}
