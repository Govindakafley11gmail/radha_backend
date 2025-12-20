/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  UploadedFiles,
  UseInterceptors,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, PaginationDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ResponseService } from 'src/common/response/response';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

const responseService = new ResponseService();

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(__dirname, '../../../uploads');
          if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
           
          const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/mkv'];
        if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Invalid file type'), false);
      },
    }),
  )
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      // Map uploaded files into contentSections
      const fileSections = files.map((file) => {
         
        const ext = path.extname(file.originalname).toLowerCase();
        const type = ['.mp4', '.mkv'].includes(ext) ? 'video' : 'image';
        return { type, value: `/uploads/${file.filename}` };
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      createBlogDto.contentSections = [...(createBlogDto.contentSections || []), ...fileSections];

      const blog = await this.blogsService.create(createBlogDto);
      return responseService.success(blog, 'Blog created successfully', HttpStatus.CREATED);
    } catch (error: any) {
       
      return responseService.error(error?.message || 'Failed to create blog', 'Blog creation failed', HttpStatus.BAD_REQUEST);
    }
  }

@Get()
async findAll(@Query() pagination: PaginationDto) {
  try {
    const blogs = await this.blogsService.findAll(pagination);

    return responseService.success(
      blogs,
      'Blogs fetched successfully',
      HttpStatus.OK,
    );
  } catch (error: any) {
    return responseService.error(
      error?.message || 'Failed to fetch blogs',
      'Fetch failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const blog = await this.blogsService.findOne(id);
      return responseService.success(blog, 'Blog fetched successfully', HttpStatus.OK);
    } catch (error: any) {
      return responseService.error(error?.message || 'Blog not found', 'Fetch failed', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    try {
      const blog = await this.blogsService.update(id, dto);
      return responseService.success(blog, 'Blog updated successfully', HttpStatus.OK);
    } catch (error: any) {
      return responseService.error(error?.message || 'Failed to update blog', 'Update failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.blogsService.remove(id);
      return responseService.success(null, `Blog with id ${id} deleted successfully`, HttpStatus.OK);
    } catch (error: any) {
      return responseService.error(error?.message || 'Failed to delete blog', 'Delete failed', HttpStatus.BAD_REQUEST);
    }
  }
}
