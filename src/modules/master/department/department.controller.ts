import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ResponseService } from 'src/common/response/response';
import { DepartmentsService } from './department.service';

@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      const department = await this.departmentsService.create(createDepartmentDto);
      return this.responseService.success(department, 'Department created successfully', HttpStatus.CREATED);
    } catch (error: any) {
      return this.responseService.error(error || 'Failed to create department', 'Department creation failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const departments = await this.departmentsService.findAll();
      return this.responseService.success(departments, 'Departments fetched successfully', HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(error || 'Failed to fetch departments', 'Departments fetch failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const department = await this.departmentsService.findOne(id);
      return this.responseService.success(department, 'Department fetched successfully', HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(error || 'Department not found', 'Department fetch failed', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    try {
      const updatedDepartment = await this.departmentsService.update(id, updateDepartmentDto);
      return this.responseService.success(updatedDepartment, 'Department updated successfully', HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(error || 'Failed to update department', 'Department update failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.departmentsService.remove(id);
      return this.responseService.success(null, 'Department deleted successfully', HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(error || 'Failed to delete department', 'Department deletion failed', HttpStatus.BAD_REQUEST);
    }
  }
}
