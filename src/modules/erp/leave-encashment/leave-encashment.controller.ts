import { Controller, Get, Post, Patch, Delete, Body, Param, Req, HttpStatus } from '@nestjs/common';
import { LeaveEncashmentService } from './leave-encashment.service';
import { CreateLeaveEncashmentDto } from './dto/create-leave-encashment.dto';
import { UpdateLeaveEncashmentDto } from './dto/update-leave-encashment.dto';
import { ResponseService } from 'src/common/response/response';
import express from 'express';

const responseService = new ResponseService();

interface AuthRequest extends express.Request {
  user: {
    id: number;
    role: string;
  };
}

@Controller('leave-encashment')
export class LeaveEncashmentController {
  constructor(private readonly leaveEncashmentService: LeaveEncashmentService) {}

  @Post()
  async create(@Req() req: AuthRequest, @Body() createDto: CreateLeaveEncashmentDto) {
    try {
      const encashment = await this.leaveEncashmentService.create(req.user.id, createDto);
      return responseService.success(encashment, 'Leave encashment request submitted', HttpStatus.CREATED);
    } catch (err) {
      return responseService.error(err instanceof Error ? err.message : String(err), 'Failed to submit request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Req() req: AuthRequest) {
    const encashments = await this.leaveEncashmentService.findAll(req.user.id);
    return responseService.success(encashments, 'Leave encashments fetched', HttpStatus.OK);
  }

  @Get(':id')
  async findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    const encashment = await this.leaveEncashmentService.findOne(req.user.id, id);
    return responseService.success(encashment, 'Leave encashment fetched', HttpStatus.OK);
  }

  @Patch(':id')
  async update(@Req() req: AuthRequest, @Param('id') id: string, @Body() updateDto: UpdateLeaveEncashmentDto) {
    const updated = await this.leaveEncashmentService.update(req.user.id, id, updateDto, req.user.role);
    return responseService.success(updated, 'Leave encashment updated', HttpStatus.OK);
  }

  @Delete(':id')
  async remove(@Req() req: AuthRequest, @Param('id') id: string) {
    const result = await this.leaveEncashmentService.remove(req.user.id, id);
    return responseService.success(result, 'Leave encashment deleted', HttpStatus.OK);
  }
}
