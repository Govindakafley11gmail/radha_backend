import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxInvoice } from './entities/taxinvoice.entity';
import { CreateTaxInvoiceDto } from './dto/create-taxinvoice.dto';
import { UpdateTaxinvoiceDto } from './dto/update-taxinvoice.dto';

@Injectable()
export class TaxinvoiceService {
  constructor(
    @InjectRepository(TaxInvoice)
    private readonly taxInvoiceRepository: Repository<TaxInvoice>,
  ) {}

  // Create a new TaxInvoice
  async create(createDto: CreateTaxInvoiceDto): Promise<TaxInvoice> {
    const taxInvoice = this.taxInvoiceRepository.create({
      customerId: createDto.customerId,
      invoiceNumber: createDto.invoiceNumber,
      invoiceDate: new Date(createDto.invoiceDate),
      totalAmount: Number(createDto.totalAmount),
      taxAmount: Number(createDto.taxAmount),
    });

    return this.taxInvoiceRepository.save(taxInvoice);
  }

  // Find all TaxInvoices
  async findAll(): Promise<TaxInvoice[]> {
    return this.taxInvoiceRepository.find();
  }

  // Find one TaxInvoice by id
  async findOne(id: string): Promise<TaxInvoice> {
    const taxInvoice = await this.taxInvoiceRepository.findOne({ where: { id } });
    if (!taxInvoice) throw new NotFoundException(`TaxInvoice with id ${id} not found`);
    return taxInvoice;
  }

  // Update a TaxInvoice
  async update(id: string, updateDto: UpdateTaxinvoiceDto): Promise<TaxInvoice> {
    const taxInvoice = await this.findOne(id);
    Object.assign(taxInvoice, {
      customerId: updateDto.customerId ?? taxInvoice.customerId,
      invoiceNumber: updateDto.invoiceNumber ?? taxInvoice.invoiceNumber,
      invoiceDate: updateDto.invoiceDate ? new Date(updateDto.invoiceDate) : taxInvoice.invoiceDate,
      totalAmount: updateDto.totalAmount !== undefined ? Number(updateDto.totalAmount) : taxInvoice.totalAmount,
      taxAmount: updateDto.taxAmount !== undefined ? Number(updateDto.taxAmount) : taxInvoice.taxAmount,
    });
    return this.taxInvoiceRepository.save(taxInvoice);
  }

  // Remove (soft-delete) a TaxInvoice
  async remove(id: string): Promise<void> {
    const taxInvoice = await this.findOne(id);
    await this.taxInvoiceRepository.remove(taxInvoice);
  }
}
