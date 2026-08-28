/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';
import { Response } from 'express';

@Injectable()
export class PurchaseInvoiceReportService {
    constructor(
        @InjectRepository(PurchaseInvoice)
        private readonly purchaseInvoiceRepository: Repository<PurchaseInvoice>,
    ) { }

    // =========================
    // Fetch invoices with filters
    // =========================
    async findAll(search?: {
        invoiceNo?: string;
        supplierName?: string;
        fromDate?: string;
        toDate?: string;
        status?: string;
    }): Promise<PurchaseInvoice[]> {
        const query = this.purchaseInvoiceRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.supplier', 'supplier')
            .leftJoinAndSelect('invoice.purchaseInvoiceDetails', 'details')
            .where('invoice.isDeleted = :isDeleted', { isDeleted: false });

        if (search?.invoiceNo) {
            query.andWhere('invoice.invoiceNo ILIKE :invoiceNo', {
                invoiceNo: `%${search.invoiceNo}%`,
            });
        }

        if (search?.supplierName) {
            query.andWhere('supplier.name ILIKE :supplierName', {
                supplierName: `%${search.supplierName}%`,
            });
        }

        if (search?.fromDate) {
            query.andWhere('invoice.invoiceDate >= :fromDate', {
                fromDate: search.fromDate,
            });
        }

        if (search?.toDate) {
            query.andWhere('invoice.invoiceDate <= :toDate', {
                toDate: search.toDate,
            });
        }

        if (search?.status) {
            query.andWhere('invoice.status = :status', {
                status: search.status,
            });
        }

        return await query.getMany();
    }

   
}
