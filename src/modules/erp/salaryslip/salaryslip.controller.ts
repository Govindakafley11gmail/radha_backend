import { Controller, Get, Param, Req,  } from '@nestjs/common';
import { SalaryslipService } from './salaryslip.service';
import express from 'express';

interface AuthRequest extends express.Request {
  user: {
    id: number;
    role: string;
  };
}
@Controller('salaryslip')
export class SalaryslipController {
  constructor(private readonly salaryslipService: SalaryslipService) {}

 

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.salaryslipService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryslipService.findOne(id);
  }
}
