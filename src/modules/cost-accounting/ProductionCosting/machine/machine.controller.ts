import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { ResponseService } from 'src/common/response/response';

@Controller('machine')
export class MachineController {
  private responseService = new ResponseService();

  constructor(private readonly machineService: MachineService) {}

  @Post()
  async create(@Body() createMachineDto: CreateMachineDto) {
    try {
      const machine = await this.machineService.create(createMachineDto);
      return this.responseService.success(machine, 'Machine created successfully', HttpStatus.CREATED);
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create machine',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const machines = await this.machineService.findAll();
      return this.responseService.success(machines, 'Machines retrieved successfully', HttpStatus.OK);
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch machines',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const machine = await this.machineService.findOne(id);
      return this.responseService.success(machine, 'Machine retrieved successfully', HttpStatus.OK);
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Machine not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
    try {
      const machine = await this.machineService.update(id, updateMachineDto);
      return this.responseService.success(machine, 'Machine updated successfully', HttpStatus.OK);
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update machine',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.machineService.remove(id);
      return this.responseService.success(null, 'Machine deleted successfully', HttpStatus.NO_CONTENT);
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete machine',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
