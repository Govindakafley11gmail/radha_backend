import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    try {
      const branch = await this.branchesService.create(createBranchDto);
      return responseService.success(
        branch,
        'Branch created successfully',
        HttpStatus.CREATED,
      );
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create branch',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const branches = await this.branchesService.findAll();
      return responseService.success(
        branches,
        'Branches fetched successfully',
        HttpStatus.OK,
      );
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch branches',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const branch = await this.branchesService.findOne(id);
      return responseService.success(
        branch,
        'Branch fetched successfully',
        HttpStatus.OK,
      );
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Branch with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    try {
      const updatedBranch = await this.branchesService.update(
        id,
        updateBranchDto,
      );
      return responseService.success(
        updatedBranch,
        'Branch updated successfully',
        HttpStatus.OK,
      );
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to update branch with id ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.branchesService.remove(id);
      return responseService.success(
        null,
        `Branch with id ${id} deleted successfully`,
        HttpStatus.OK,
      );
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to delete branch with id ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
