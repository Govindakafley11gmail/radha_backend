import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesReturn } from './entities/sales-return.entity';
import { SalesInvoice } from 'src/modules/account_receivable/sales-invoice/entities/sales-invoice.entity';
import { CreateSalesReturnDto } from './dto/create-sales-return.dto';
import { UpdateSalesReturnDto } from './dto/update-sales-return.dto';

@Injectable()
export class SalesReturnService {
  constructor(
    @InjectRepository(SalesReturn)
    private readonly salesReturnRepo: Repository<SalesReturn>,

    @InjectRepository(SalesInvoice)
    private readonly salesInvoiceRepo: Repository<SalesInvoice>,
  ) {}

  /* ---------------- CREATE ---------------- */
  async create(dto: CreateSalesReturnDto): Promise<SalesReturn> {
    const invoice = await this.salesInvoiceRepo.findOne({
      where: { id: dto.salesInvoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Sales invoice not found');
    }

    const salesReturn = this.salesReturnRepo.create({
      salesInvoice: invoice,
      return_date: dto.return_date,
      quantity: dto.quantity,
      amount: dto.amount,
    });

    return await this.salesReturnRepo.save(salesReturn);
  }

  /* ---------------- FIND ALL ---------------- */
  async findAll(): Promise<SalesReturn[]> {
    return await this.salesReturnRepo.find({
      relations: ['salesInvoice'],
      order: { return_date: 'DESC' },
    });
  }

  /* ---------------- FIND ONE ---------------- */
  async findOne(id: string): Promise<SalesReturn> {
    const salesReturn = await this.salesReturnRepo.findOne({
      where: { id },
      relations: ['salesInvoice'],
    });

    if (!salesReturn) {
      throw new NotFoundException('Sales return not found');
    }

    return salesReturn;
  }

  /* ---------------- UPDATE ---------------- */
  async update(
    id: string,
    dto: UpdateSalesReturnDto,
  ): Promise<SalesReturn> {
    const salesReturn = await this.findOne(id);

    Object.assign(salesReturn, dto);

    return await this.salesReturnRepo.save(salesReturn);
  }

  /* ---------------- DELETE ---------------- */
  async remove(id: string): Promise<void> {
    const salesReturn = await this.findOne(id);
    await this.salesReturnRepo.remove(salesReturn);
  }
}
