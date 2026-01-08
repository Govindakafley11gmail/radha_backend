/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Query,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RawMaterialReceiptService } from './raw-material-receipt.service';
import { CreateRawMaterialReceiptDto } from './dto/create-raw-material-receipt.dto';
import { ResponseService } from 'src/common/response/response';
import type { Response } from 'express';
import { extname } from 'path';
import * as mime from 'mime-types';

interface UserRole {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthRequest {
  user: {
    id: string;
    role: UserRole;
  };
}

const responseService = new ResponseService();

@Controller('raw-material-receipt')
export class RawMaterialReceiptController {
  constructor(private readonly rawMaterialReceiptService: RawMaterialReceiptService) {}

  // ================= CREATE WITH FILE UPLOAD =================
  @Post()
  @UseInterceptors(
    FileInterceptor('documentPath', {
      storage: diskStorage({
        destination: './uploads/raw-material',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
          return cb(new Error('Only image or PDF files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  async create(
    @Body() createDto: CreateRawMaterialReceiptDto,
    @UploadedFile() documentPath: Express.Multer.File,
  ) {
    try {
      const receipt = await this.rawMaterialReceiptService.createAndPostReceipt(
        createDto,
        documentPath?.path,
      );
      return responseService.success(receipt, 'Raw material receipt created successfully', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create raw material receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ================= GET APPROVALS / ROLE-BASED =================
  @Get('/approval')
  async findAllByUserRole(
    @Req() req: AuthRequest,
    @Query('search') search?: string,
  ) {
    try {
      const employeeId = req.user.id;
const roles = req.user.role as unknown as UserRole[]; // Type assertion

      // const hasFullAccess = roleName === 'Admin' || roleName === 'Manager';

      const receipts = await this.rawMaterialReceiptService.findAllByUserRole(
        employeeId,
        roles,
        search,
      );

      return responseService.success(receipts, 'Raw material receipts fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch raw material receipts',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ================= GET ALL =================
  @Get()
  async findAll(@Query('search') search?: string) {
    const receipts = await this.rawMaterialReceiptService.findAll(search);
    return responseService.success(receipts, 'Raw material receipts fetched successfully', HttpStatus.OK);
  }

  // ================= GET ONE =================
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const receipt = await this.rawMaterialReceiptService.findOne(id);
      return responseService.success(receipt, 'Raw material receipt fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch raw material receipt',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // ================= UPDATE =================
  @Patch(':id')
  async update(
    @Param('id') id: string,
        @Req() req: AuthRequest,

  ) {
    try {
      const roles = req.user.role as unknown as UserRole[]; // Type assertion

      const updatedReceipt = await this.rawMaterialReceiptService.update(id,roles);
      return responseService.success(updatedReceipt, 'Raw material receipt updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update raw material receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ================= DELETE =================
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.rawMaterialReceiptService.remove(id);
      return responseService.success(null, 'Raw material receipt removed successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to remove raw material receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ================= GENERATE PDF =================
  @Get('generate/:id')
  async generateReceipt(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.rawMaterialReceiptService.generateReceipt(id, res);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ================= DOWNLOAD DOCUMENT =================
  @Get('download/:id')
  async downloadDocument(@Param('id') id: string, @Res() res: Response) {
    try {
      const { filePath, fileName } = await this.rawMaterialReceiptService.downloadDocument(id);
      const mimeType = mime.lookup(filePath) || 'application/octet-stream';
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
@Patch(':id/reject')
async rejectPurchaseInvoice(
  @Param('id') id: string,
  @Req() req: any,
  @Res() res: Response,
) {
  try {
    const result = await this.rawMaterialReceiptService.remove(
      id,
    );

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Purchase invoice rejected successfully',
      data: result,
    });
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
}

}
