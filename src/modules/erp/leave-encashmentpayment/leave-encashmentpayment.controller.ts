/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { Request } from 'express';
import { LeaveEncashmentpaymentService } from './leave-encashmentpayment.service';
import { CreateLeaveEncashmentpaymentDto } from './dto/create-leave-encashmentpayment.dto';
import { UpdateLeaveEncashmentpaymentDto } from './dto/update-leave-encashmentpayment.dto';

@Controller('leave-encashmentpayment')
export class LeaveEncashmentpaymentController {
  constructor(private readonly leaveEncashmentpaymentService: LeaveEncashmentpaymentService) {}

  // ==========================================================
  // CREATE PAYMENT
  // ==========================================================
  @Post()
  async create(
    @Body() createDto: CreateLeaveEncashmentpaymentDto,
    @Req() req, // get user info from request
  ) {
    // assuming your authentication adds user info in req.user
    const processedById = req.user?.id;
    return this.leaveEncashmentpaymentService.create(createDto, processedById);
  }

  // ==========================================================
  // GET ALL PAYMENTS
  // ==========================================================
  @Get()
  async findAll() {
    return this.leaveEncashmentpaymentService.findAll();
  }

  // ==========================================================
  // GET ONE PAYMENT
  // ==========================================================
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leaveEncashmentpaymentService.findOne(id);
  }

  // ==========================================================
  // UPDATE PAYMENT
  // ==========================================================
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateLeaveEncashmentpaymentDto,
  ) {
    return this.leaveEncashmentpaymentService.update(id, updateDto);
  }

  // ==========================================================
  // DELETE PAYMENT
  // ==========================================================
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.leaveEncashmentpaymentService.remove(id);
  }
}
