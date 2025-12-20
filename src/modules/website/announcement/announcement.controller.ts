import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';

import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto, PaginationFilterAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  async create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    try {
      const announcement = await this.announcementService.create(createAnnouncementDto);
      return responseService.success(
        announcement,
        'Announcement created successfully',
        HttpStatus.CREATED,
      );
    } catch (error: any) {
      return responseService.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error || 'Failed to create announcement',
        'Announcement creation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(@Query() pagination: PaginationFilterAnnouncementDto) {
    try {
      const announcements = await this.announcementService.findAll(pagination);
      return responseService.success(
        announcements,
        'Announcements fetched successfully',
        HttpStatus.OK,
      );
    } catch (error: any) {
      return responseService.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error || 'Failed to fetch announcements',
        'Fetch failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const announcement = await this.announcementService.findOne(+id);
      return responseService.success(
        announcement,
        'Announcement fetched successfully',
        HttpStatus.OK,
      );
    } catch (error: any) {
      return responseService.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error || 'Announcement not found',
        'Fetch failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    try {
      const announcement = await this.announcementService.update(+id, updateAnnouncementDto);
      return responseService.success(
        announcement,
        'Announcement updated successfully',
        HttpStatus.OK,
      );
    } catch (error: any) {
      return responseService.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error || 'Failed to update announcement',
        'Update failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.announcementService.remove(+id);
      return responseService.success(
        null,
        'Announcement deleted successfully',
        HttpStatus.OK,
      );
    } catch (error: any) {
      return responseService.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error || 'Failed to delete announcement',
        'Delete failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
