/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
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

    // =========================
    // Export to Excel
    // =========================
    async exportToExcel(res: Response, search?: any): Promise<void> {
        const invoices = await this.findAll(search);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Purchase Invoice Report');

        worksheet.columns = [
            { header: 'Invoice No', key: 'invoiceNo', width: 20 },
            { header: 'Invoice Date', key: 'invoiceDate', width: 15 },
            { header: 'Supplier', key: 'supplier', width: 25 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Total Amount', key: 'totalAmount', width: 18 },
        ];

        invoices.forEach(inv => {
            worksheet.addRow({
                invoiceNo: inv.invoiceNo,
                invoiceDate: inv.invoiceDate,
                supplier: inv.supplier?.name,
                status: inv.status,
                totalAmount: inv.finalCost,
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=purchase_invoice_report.xlsx',
        );

        await workbook.xlsx.write(res);
        res.end();
    }

    // =========================
    // Export to PDF
    // =========================
    async exportToPdf(res: Response, search?: any): Promise<void> {
        const invoices = await this.findAll(search);

        const doc = new PDFDocument({ size: 'A4', margin: 40 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=purchase_invoice_report.pdf',
        );

        doc.pipe(res);

        doc.fontSize(16).text('Purchase Invoice Report', { align: 'center' });
        doc.moveDown();

        invoices.forEach((inv, index) => {
            doc
                .fontSize(10)
                .text(
                    `${index + 1}. Invoice No: ${inv.invoiceNo}
Supplier: ${inv.supplier?.name}
Date: ${inv.invoiceDate.toISOString().split('T')[0]}
Status: ${inv.status}
Total: ${inv.finalCost}
-----------------------------`,
                );
        });

        doc.end();
    }
}
