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
import { extname, join } from 'path';
import { existsSync } from 'fs';
import type { Response } from 'express';

import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ResponseService } from 'src/common/response/response';

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
    @Res({ passthrough: false }) res: Response,
  ) {
    try {
      const supplier = await this.supplierService.findOne(id);

      if (!supplier?.mouFile) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'No MOU file uploaded for this supplier',
        });
      }
    console.log(supplier?.mouFile)
      // ✅ mouFile must be ONLY filename
      const filePath = join(process.cwd(), supplier.mouFile);
      console.log("filePath",filePath)
      if (!existsSync(filePath)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'File not found on server',
        });
      }

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${supplier.mouFile}"`,
      );
      res.setHeader('Content-Type', 'application/octet-stream');

       return res.download(filePath, supplier.mouFile);

    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Failed to download MOU',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
