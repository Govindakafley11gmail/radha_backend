import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseService } from 'src/common/response/response';
import Api_URL from 'src/router/authentication';

const responseService = new ResponseService();

@Controller(Api_URL.permission)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    try {
      const permission = await this.permissionService.create(createPermissionDto);
      return responseService.success(permission, 'Permission created successfully', HttpStatus.CREATED);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create permission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const permissions = await this.permissionService.findAll();
      return responseService.success(permissions, 'Permissions fetched successfully', HttpStatus.OK);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch permissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
   async findOne(@Param('id') id: string) {
    try {
      const permission = await this.permissionService.findOne(+id);
      return responseService.success(permission, 'Permission fetched successfully',HttpStatus.OK);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Permission not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    try {
      const updatedPermission = await this.permissionService.update(+id, updatePermissionDto);
      return responseService.success(updatedPermission, 'Permission updated successfully',HttpStatus.CREATED);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update permission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async  remove(@Param('id') id: string) {
    try {
     await this.permissionService.remove(+id);
      return responseService.success(null, `Permission with id ${id} deleted successfully`, HttpStatus.OK);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete permission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
