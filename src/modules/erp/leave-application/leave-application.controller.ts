import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req } from '@nestjs/common';
import { LeaveApplicationService } from './leave-application.service';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';
import { ResponseService } from 'src/common/response/response';
import { Request } from 'express';

const responseService = new ResponseService();

interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

@Controller('leave-application')
export class LeaveApplicationController {
  constructor(private readonly leaveApplicationService: LeaveApplicationService) {}

  // Create a new leave application
  @Post()
  async create(@Req() req: AuthRequest, @Body() createDto: CreateLeaveApplicationDto) {
    try {
      const employeeId = req.user.id;
      const leaveApplication = await this.leaveApplicationService.create(+employeeId, createDto);
      return responseService.success(leaveApplication, 'Leave application submitted successfully', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to submit leave application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Get all leave applications for logged-in user
  @Get()
  async findAll(@Req() req: AuthRequest) {
    try {
      const employeeId = req.user.id;
      const leaveApplications = await this.leaveApplicationService.findAll(+employeeId);
      return responseService.success(leaveApplications, 'Leave applications fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch leave applications',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

 @Get('/leave_balance')
  async leavesBalance(@Req() req: AuthRequest) {
    try {
      const employeeId = req.user.id;
      const leaveApplications = await this.leaveApplicationService.leavesBalance(+employeeId);
      return responseService.success(leaveApplications, 'Leave applications fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch leave applications',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
  // Get a single leave application by ID
  @Get(':id')
  async findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    try {
      const employeeId = req.user.id;
      const leaveApplication = await this.leaveApplicationService.findOne(+employeeId, id);
      return responseService.success(leaveApplication, 'Leave application fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch leave application',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Update a leave application by ID
  @Patch(':id')
  async update(@Req() req: AuthRequest, @Param('id') id: string, @Body() updateDto: UpdateLeaveApplicationDto) {
    try {
      const employeeId = req.user.id;
      const userRole = req.user.role; // Pass role to service for approval logic
      const leaveApplication = await this.leaveApplicationService.update(+employeeId, id, updateDto, userRole);
      return responseService.success(leaveApplication, 'Leave application updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update leave application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Delete a leave application by ID
  @Delete(':id')
  async remove(@Req() req: AuthRequest, @Param('id') id: string) {
    try {
      const employeeId = req.user.id;
      const result = await this.leaveApplicationService.remove(+employeeId, id);
      return responseService.success(result, 'Leave application deleted successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete leave application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
