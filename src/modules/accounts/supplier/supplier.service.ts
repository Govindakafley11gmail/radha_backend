import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Like, Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  // Create supplier with optional MOU file path
  async create(createSupplierDto: CreateSupplierDto, mouFilePath?: string): Promise<Supplier> {
    const supplier = this.supplierRepository.create(createSupplierDto);
    if (mouFilePath) {
      supplier.mouFile = mouFilePath;
    }
    return await this.supplierRepository.save(supplier);
  }

  // Find all suppliers (excluding soft deleted)
  async findAll(): Promise<Supplier[]> {
    return await this.supplierRepository.find({
      where: { isDeleted: false },
      relations: ['purchaseInvoices', 'rawMaterialReceipts'],
    });
  }

async findAllWithSearch(search: string): Promise<Supplier[]> {
  console.log("search",search)
 if (!search) {
  console.log("rdtfgyhuji",search)
  return [];
}
  return await this.supplierRepository.find({
    where: [
      {
        isDeleted: false,
        cidNo: search,
      },
      {
        isDeleted: false,
        name: Like(`%${search}%`),
      },
      {
        isDeleted: false,
        email: Like(`%${search}%`),
      },
      {
        isDeleted: false,
        phone_no: Like(`%${search}%`),
      },
    ],
  });
}

  // Find one supplier by ID
  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { supplier_id: id, isDeleted: false },
      relations: ['purchaseInvoices', 'rawMaterialReceipts'],
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }
    return supplier;
  }

  // Update supplier by ID
  async update(id: string, updateSupplierDto: UpdateSupplierDto, mouFilePath?: string): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, updateSupplierDto);
    if (mouFilePath) {
      supplier.mouFile = mouFilePath;
    }
    return await this.supplierRepository.save(supplier);
  }

  // Soft delete supplier
  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    supplier.isDeleted = true;
    await this.supplierRepository.save(supplier);
  }
  async downloadMouFile(id: string): Promise<{ filePath: string; fileName: string }> {
    const supplier = await this.supplierRepository.findOne({ where: { supplier_id:id } });
    if (!supplier) throw new NotFoundException(`Supplier ${id} not found`);

    if (!supplier.mouFile) {
      throw new NotFoundException(`No MOU file uploaded for supplier ${supplier.name}`);
    }

    const filePath = join(process.cwd(), 'uploads', supplier.supplier_id);
    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found on server: ${supplier.supplier_id}`);
    }

    return { filePath, fileName: supplier.supplier_id };
  }
}
