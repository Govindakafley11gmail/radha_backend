import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto, PaginationFilterAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  /* -------------------- CREATE -------------------- */
  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = this.announcementRepository.create(createAnnouncementDto);
    return await this.announcementRepository.save(announcement);
  }

  /* -------------------- FIND ALL -------------------- */
async findAll(pagination: PaginationFilterAnnouncementDto) {
  const { page, limit, isActive, search } = pagination;

  const skip = (page - 1) * limit;

  const query = this.announcementRepository.createQueryBuilder('announcement');

  /* ----------- filters ----------- */
  if (isActive !== undefined) {
    query.andWhere('announcement.isActive = :isActive', {
      isActive: isActive === 'true',
    });
  }

  if (search) {
    query.andWhere(
      '(announcement.title ILIKE :search OR announcement.description ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  /* ----------- pagination ----------- */
  query
    .orderBy('announcement.createdAt', 'DESC')
    .skip(skip)
    .take(limit);

  const [data, total] = await query.getManyAndCount();

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}


  /* -------------------- FIND ONE -------------------- */
  async findOne(id: number): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    return announcement;
  }

  /* -------------------- UPDATE -------------------- */
  async update(
    id: number,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findOne(id);

    Object.assign(announcement, updateAnnouncementDto);

    return await this.announcementRepository.save(announcement);
  }

  /* -------------------- REMOVE -------------------- */
  async remove(id: number): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementRepository.remove(announcement);
  }
}
