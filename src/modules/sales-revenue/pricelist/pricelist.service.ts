import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceList } from './entities/pricelist.entity';
import { CreatePricelistDto } from './dto/create-pricelist.dto';
import { UpdatePricelistDto } from './dto/update-pricelist.dto';
import { SalesInvoice } from 'src/modules/account_receivable/sales-invoice/entities/sales-invoice.entity';

@Injectable()
export class PricelistService {
  constructor(
    @InjectRepository(PriceList)
    private readonly pricelistRepo: Repository<PriceList>,

    @InjectRepository(SalesInvoice)
    private readonly salesInvoiceRepo: Repository<SalesInvoice>,
  ) {}

  async create(createPricelistDto: CreatePricelistDto) {
    const pricelist = this.pricelistRepo.create(createPricelistDto);

    // Link SalesInvoice if provided
    if (createPricelistDto.sales_invoice_id) {
      const invoice = await this.salesInvoiceRepo.findOne({
        where: { id: createPricelistDto.sales_invoice_id },
      });
      if (!invoice) throw new NotFoundException('SalesInvoice not found');
      pricelist.salesInvoice = invoice;
    }

    return this.pricelistRepo.save(pricelist);
  }

  findAll() {
    return this.pricelistRepo.find({ relations: ['salesInvoice'] });
  }

  async findOne(id: string) {
    const pricelist = await this.pricelistRepo.findOne({
      where: { id },
      relations: ['salesInvoice'],
    });
    if (!pricelist) throw new NotFoundException(`PriceList #${id} not found`);
    return pricelist;
  }

  async update(id: string, updatePricelistDto: UpdatePricelistDto) {
    const pricelist = await this.findOne(id);

    if (updatePricelistDto.sales_invoice_id) {
      const invoice = await this.salesInvoiceRepo.findOne({
        where: { id: updatePricelistDto.sales_invoice_id },
      });
      if (!invoice) throw new NotFoundException('SalesInvoice not found');
      pricelist.salesInvoice = invoice;
    }

    Object.assign(pricelist, updatePricelistDto);
    return this.pricelistRepo.save(pricelist);
  }

  async remove(id: string) {
    const pricelist = await this.findOne(id);
    pricelist.isDeleted = true;
   return await this.pricelistRepo.save(pricelist);
  }
}
