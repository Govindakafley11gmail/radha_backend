import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseInvoiceDetail } from './entities/purchaseinvoicedetail.entity';
// import { CreatePurchaseInvoiceDto } from './dto/create-purchaseinvoicedetail.dto';
// import { UpdatePurchaseinvoicedetailDto } from './dto/update-purchaseinvoicedetail.dto';

@Injectable()
export class PurchaseinvoicedetailsService {
  constructor(
    @InjectRepository(PurchaseInvoiceDetail)
    private readonly purchaseInvoiceDetailRepo: Repository<PurchaseInvoiceDetail>,
  ) {}

  // async create(createDto: CreatePurchaseInvoiceDto) {
  //   const entity = this.purchaseInvoiceDetailRepo.create(createDto);
  //   return await this.purchaseInvoiceDetailRepo.save(entity);
  // }

  async findAll() {
    return await this.purchaseInvoiceDetailRepo.find({
      where: { isDeleted: false },
    });
  }

  async findOne(id: string) {
    const entity = await this.purchaseInvoiceDetailRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException(`PurchaseInvoiceDetail ${id} not found`);
    return entity;
  }

  // async update(id: string, updateDto: UpdatePurchaseinvoicedetailDto) {
  //   const entity = await this.findOne(id);
  //   Object.assign(entity, updateDto);
  //   return await this.purchaseInvoiceDetailRepo.save(entity);
  // }

  async remove(id: string) {
    const entity = await this.findOne(id);
    entity.isDeleted = true; // soft delete
    return await this.purchaseInvoiceDetailRepo.save(entity);
  }
}
