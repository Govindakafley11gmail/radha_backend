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
import { DiscountSchemeService } from './discount-scheme.service';
import { CreateDiscountSchemeDto } from './dto/create-discount-scheme.dto';
import { UpdateDiscountSchemeDto } from './dto/update-discount-scheme.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('discount-scheme')
export class DiscountSchemeController {
  constructor(
    private readonly discountSchemeService: DiscountSchemeService,
  ) {}

  @Post()
  async create(@Body() createDiscountSchemeDto: CreateDiscountSchemeDto) {
    try {
      const scheme = await this.discountSchemeService.create(
        createDiscountSchemeDto,
      );

      return responseService.success(
        scheme,
        'Discount scheme created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create discount scheme',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const schemes = await this.discountSchemeService.findAll();
      return responseService.success(
        schemes,
        'Discount schemes fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch discount schemes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const scheme = await this.discountSchemeService.findOne(id);
      return responseService.success(
        scheme,
        'Discount scheme fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Discount scheme not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiscountSchemeDto: UpdateDiscountSchemeDto,
  ) {
    try {
      const scheme = await this.discountSchemeService.update(
        id,
        updateDiscountSchemeDto,
      );

      return responseService.success(
        scheme,
        'Discount scheme updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update discount scheme',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.discountSchemeService.remove(id);
      return responseService.success(
        null,
        'Discount scheme deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete discount scheme',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
