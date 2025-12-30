import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesInvoiceDetail } from './entities/sales-invoice-detail.entity';

@Injectable()
export class SalesInvoiceDetailsService {
  constructor(
    @InjectRepository(SalesInvoiceDetail)
    private readonly detailRepository: Repository<SalesInvoiceDetail>,
  ) {}



  // Return all SalesInvoiceDetails
  async findAll(): Promise<SalesInvoiceDetail[]> {
    return this.detailRepository.find({ where: { isDeleted: false } });
  }

  // Return one SalesInvoiceDetail by id
  async findOne(id: string): Promise<SalesInvoiceDetail> {
    const detail = await this.detailRepository.findOne({ where: { id, isDeleted: false } });
    if (!detail) throw new NotFoundException(`SalesInvoiceDetail with id ${id} not found`);
    return detail;
  }

  // Update a SalesInvoiceDetail
  // async update(id: string, updateDto: UpdateSalesInvoiceDetailDto): Promise<SalesInvoiceDetail> {
  //   const detail = await this.findOne(id);
  //   Object.assign(detail, {
  //     productId: updateDto.productId ? String(updateDto.productId) : detail.productId,
  //     productType: updateDto.productType ?? detail.productType,
  //     size: updateDto.size ?? detail.size,
  //     price: updateDto.price !== undefined ? Number(updateDto.price) : detail.price,
  //     quantity: updateDto.quantity !== undefined ? Number(updateDto.quantity) : detail.quantity,
  //     total:
  //       updateDto.total !== undefined
  //         ? Number(updateDto.total)
  //         : Number(detail.price * detail.quantity),
  //   });
  //   return this.detailRepository.save(detail);
  // }

  // Soft-delete a SalesInvoiceDetail
  async remove(id: string): Promise<void> {
    const detail = await this.findOne(id);
    detail.isDeleted = true;
    await this.detailRepository.save(detail);
  }
}
