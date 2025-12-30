import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountScheme } from './entities/discount-scheme.entity';
import { CreateDiscountSchemeDto } from './dto/create-discount-scheme.dto';
import { UpdateDiscountSchemeDto } from './dto/update-discount-scheme.dto';

@Injectable()
export class DiscountSchemeService {
  constructor(
    @InjectRepository(DiscountScheme)
    private readonly discountSchemeRepo: Repository<DiscountScheme>,
  ) {}

  async create(dto: CreateDiscountSchemeDto) {
    const scheme = this.discountSchemeRepo.create(dto);
    return this.discountSchemeRepo.save(scheme);
  }

  findAll() {
    return this.discountSchemeRepo.find({ where: { isDeleted: false } });
  }

  async findOne(id: string) {
    const scheme = await this.discountSchemeRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!scheme) throw new NotFoundException(`DiscountScheme #${id} not found`);
    return scheme;
  }

  async update(id: string, dto: UpdateDiscountSchemeDto) {
    const scheme = await this.findOne(id);
    Object.assign(scheme, dto);
    return this.discountSchemeRepo.save(scheme);
  }

  async remove(id: string) {
    const scheme = await this.findOne(id);
    scheme.isDeleted = true; // soft delete
    return this.discountSchemeRepo.save(scheme);
  }
}
