/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { BadDebtService } from './bad-debt.service';
import { CreateBadDebtDto } from './dto/create-bad-debt.dto';
import { UpdateBadDebtDto } from './dto/update-bad-debt.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('bad-debt')
export class BadDebtController {
  constructor(private readonly badDebtService: BadDebtService) {}

  @Post()
  async create(@Body() createBadDebtDto: CreateBadDebtDto, @Req() req) {
    try {
      const userId = req.user.id; // <-- user ID from JWT payload

      const badDebt = await this.badDebtService.create(
        createBadDebtDto,
        userId,
      );

      return responseService.success(
        badDebt,
        'Bad debt created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create bad debt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const badDebts = await this.badDebtService.findAll();
      return responseService.success(
        badDebts,
        'Bad debts fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch bad debts',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const badDebt = await this.badDebtService.findOne(id);
      return responseService.success(
        badDebt,
        'Bad debt fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Bad debt not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBadDebtDto: UpdateBadDebtDto,
  ) {
    try {
      const badDebt = await this.badDebtService.update(
        id,
        updateBadDebtDto,
      );

      return responseService.success(
        badDebt,
        'Bad debt updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update bad debt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.badDebtService.remove(id);
      return responseService.success(
        null,
        'Bad debt deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete bad debt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
