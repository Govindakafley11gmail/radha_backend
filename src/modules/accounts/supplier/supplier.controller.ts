import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  // Create supplier with optional MOU upload
  @Post()
  @UseInterceptors(
    FileInterceptor('mouFile', {
      storage: diskStorage({
        destination: './uploads/mou',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(@Body() createSupplierDto: CreateSupplierDto, @UploadedFile() mouFile: Express.Multer.File) {
    try {
      const mouFilePath = mouFile ? mouFile.path : undefined;
      const supplier = await this.supplierService.create(createSupplierDto, mouFilePath);
      return responseService.success(supplier, 'Supplier created successfully', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create supplier',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const suppliers = await this.supplierService.findAll();
      return responseService.success(suppliers, 'Suppliers fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch suppliers',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const supplier = await this.supplierService.findOne(id);
      return responseService.success(supplier, 'Supplier fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch supplier',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('mouFile', {
      storage: diskStorage({
        destination: './uploads/mou',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @UploadedFile() mouFile: Express.Multer.File,
  ) {
    try {
      const mouFilePath = mouFile ? mouFile.path : undefined;
      const updatedSupplier = await this.supplierService.update(id, updateSupplierDto, mouFilePath);
      return responseService.success(updatedSupplier, 'Supplier updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update supplier',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.supplierService.remove(id);
      return responseService.success(null, 'Supplier removed successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to remove supplier',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
