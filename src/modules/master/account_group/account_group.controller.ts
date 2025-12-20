import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ResponseService } from 'src/common/response/response';
import { AccountGroupService } from './account_group.service';
import { CreateAccountGroupDto } from './dto/create-account_group.dto';
import { UpdateAccountGroupDto } from './dto/update-account_group.dto';

@Controller('account-groups')
export class AccountGroupController {
  constructor(
    private readonly accountGroupService: AccountGroupService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async create(@Body() createAccountGroupDto: CreateAccountGroupDto) {
    try {
      const group = await this.accountGroupService.create(createAccountGroupDto);
      return this.responseService.success(group, 'Account group created successfully', HttpStatus.CREATED);
    } catch (error: any) {
      return this.responseService.error(
        error || 'Failed to create account group',
        'Account group creation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const groups = await this.accountGroupService.findAll();
      return this.responseService.success(groups, 'Account groups fetched successfully', HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(
        error || 'Failed to fetch account groups',
        'Account groups fetch failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const group = await this.accountGroupService.findOne(id);
      return this.responseService.success(group, 'Account group fetched successfully', HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(
        error || 'Account group not found',
        'Account group fetch failed',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAccountGroupDto: UpdateAccountGroupDto) {
    try {
      const updatedGroup = await this.accountGroupService.update(id, updateAccountGroupDto);
      return this.responseService.success(updatedGroup, 'Account group updated successfully', HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(
        error || 'Failed to update account group',
        'Account group update failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.accountGroupService.remove(id);
      return this.responseService.success(null, 'Account group deleted successfully', HttpStatus.OK);
    } catch (error: any) {
      return this.responseService.error(
        error || 'Failed to delete account group',
        'Account group deletion failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
