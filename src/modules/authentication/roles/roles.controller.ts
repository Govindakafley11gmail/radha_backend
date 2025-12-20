/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseService } from 'src/common/response/response';
import Api_URL from 'src/router/authentication';

@Controller(Api_URL.role)
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly responseService: ResponseService, // optional for structured responses
  ) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      const role = await this.rolesService.create(createRoleDto);
      return this.responseService.success(role, 'Role created successfully', HttpStatus.CREATED);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.responseService.error(error || 'Failed to create role', 'Role creation failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const roles = await this.rolesService.findAll();
      return this.responseService.success(roles, 'Roles fetched successfully',HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(error || 'Failed to fetch roles','Failed to fetch roles',HttpStatus.OK);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const role = await this.rolesService.findOne(+id);
      return this.responseService.success(role, 'Role fetched successfully',HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(error || 'Role not found', 'Failed', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.rolesService.update(+id, updateRoleDto);
      return this.responseService.success(role, 'Role updated successfully',HttpStatus.CREATED);
    } catch (error: any) {
      return this.responseService.error(error || 'Failed to update role', 'Update failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.rolesService.remove(+id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.responseService.success(null, 'Role deleted successfully',HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(error || 'Failed to delete role', 'Delete failed', HttpStatus.BAD_REQUEST);
    }
  }
}
