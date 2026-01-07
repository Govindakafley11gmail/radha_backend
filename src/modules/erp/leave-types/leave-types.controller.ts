import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { LeaveTypesService } from './leave-types.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('leave-types')
export class LeaveTypesController {
  constructor(private readonly leaveTypesService: LeaveTypesService) {}

  // Create a new leave type
  @Post()
  async create(@Body() createLeaveTypeDto: CreateLeaveTypeDto) {
    try {
      const leaveType = await this.leaveTypesService.create(createLeaveTypeDto);
      return responseService.success(leaveType, 'Leave type created successfully', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create leave type',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Get all leave types
  @Get()
  async findAll() {
    try {
      const leaveTypes = await this.leaveTypesService.findAll();
      return responseService.success(leaveTypes, 'Leave types fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch leave types',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Get a single leave type by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const leaveType = await this.leaveTypesService.findOne(id);
      return responseService.success(leaveType, 'Leave type fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch leave type',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Update a leave type by ID
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLeaveTypeDto: UpdateLeaveTypeDto) {
    try {
      const leaveType = await this.leaveTypesService.update(id, updateLeaveTypeDto);
      return responseService.success(leaveType, 'Leave type updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update leave type',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Delete a leave type by ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.leaveTypesService.remove(id);
      return responseService.success(result, 'Leave type deleted successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete leave type',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
