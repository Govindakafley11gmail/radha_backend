import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  // Create supplier with optional MOU upload
  @Post()
  @UseInterceptors(
    FileInterceptor('mouFile', {
      storage: diskStorage({
        destination: './uploads/mou', // save files inside 'uploads/mou'
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(@Body() createSupplierDto: CreateSupplierDto, @UploadedFile() mouFile: Express.Multer.File) {
    const mouFilePath = mouFile ? mouFile.path : undefined;
    return this.supplierService.create(createSupplierDto, mouFilePath);
  }

  @Get()
  findAll() {
    return this.supplierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  // Update supplier with optional MOU file
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
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @UploadedFile() mouFile: Express.Multer.File,
  ) {
    const mouFilePath = mouFile ? mouFile.path : undefined;
    return this.supplierService.update(id, updateSupplierDto, mouFilePath);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
