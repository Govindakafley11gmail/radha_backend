/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

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
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, basename } from 'path';
import { existsSync } from 'fs';
import type { Response } from 'express';

import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ResponseService } from 'src/common/response/response';
import * as mime from 'mime-types';

const responseService = new ResponseService();

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  // ================= CREATE =================
  @Post()
  @UseInterceptors(
    FileInterceptor('mouFile', {
      storage: diskStorage({
        destination: './uploads/mou',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `mou-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
    @UploadedFile() mouFile?: Express.Multer.File,
  ) {
    try {
      const supplier = await this.supplierService.create(
        createSupplierDto,
        mouFile?.filename, // ✅ store only filename
      );

      return responseService.success(
        supplier,
        'Supplier created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create supplier',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ================= FIND ALL =================
  @Get()
  async findAll() {
    try {
      const suppliers = await this.supplierService.findAll();
      return responseService.success(
        suppliers,
        'Suppliers fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch suppliers',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ================= FIND ONE =================
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const supplier = await this.supplierService.findOne(id);
      return responseService.success(
        supplier,
        'Supplier fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Supplier not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // ================= UPDATE =================
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('mouFile', {
      storage: diskStorage({
        destination: './uploads/mou',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `mou-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @UploadedFile() mouFile?: Express.Multer.File,
  ) {
    try {
      const supplier = await this.supplierService.update(
        id,
        updateSupplierDto,
        mouFile?.filename,
      );

      return responseService.success(
        supplier,
        'Supplier updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update supplier',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ================= DELETE =================
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.supplierService.remove(id);
      return responseService.success(
        null,
        'Supplier removed successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to remove supplier',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ================= DOWNLOAD MOU =================
@Get('download-mou/:id')
async downloadMou(
  @Param('id') id: string,
  @Res() res: Response,
) {
  const supplier = await this.supplierService.findOne(id);

  if (!supplier?.mouFile) {
    return res.status(404).json({ message: 'No MOU file uploaded for this supplier' });
  }

  const filePath = join(process.cwd(), supplier.mouFile);

  if (!existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found on server' });
  }

  // ✅ Only filename, no path
  const fileName = basename(supplier.mouFile);

  // ✅ Dynamically detect MIME type
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';

  // ✅ Set proper headers
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

  // ✅ Stream file to browser
  return res.sendFile(filePath);
}
}