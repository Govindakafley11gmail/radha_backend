/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';
import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';

@Injectable()
export class PurchaseInvoiceReportPDFService {
  async generatePDF(
    invoices: PurchaseInvoice[],
    search: any,
    res: Response,
  ) {
    const fromDate = search?.fromDate ?? '-';
    const toDate = search?.toDate ?? '-';

    const grandTotal = invoices.reduce(
      (sum, i) => sum + Number(i.finalCost ?? 0),
      0,
    );

    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 25px; color: #000; }
          h1 { text-align: center; margin-bottom: 6px; font-size: 18px; }
          h3 { text-align: center; margin-bottom: 18px; font-size: 13px; }

          table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 14px; }
          th, td { border: 1px solid #000; padding: 5px; }
          th { background-color: #f0f0f0; text-align: center; }
          td { vertical-align: middle; }

          .right { text-align: right; }
          .center { text-align: center; }
          .totals { font-weight: bold; background-color: #e6e6e6; }

          .invoice-header {
            background: #fafafa;
            font-weight: bold;
          }

          .sub-table th {
            background-color: #dedede;
          }
        </style>
      </head>

      <body>
        <h1>PURCHASE INVOICE REPORT</h1>
        <h3>From: ${fromDate} &nbsp;&nbsp; To: ${toDate}</h3>

        ${invoices
          .map(
            (inv, index) => `
          <table>
            <tr class="invoice-header">
              <td colspan="11">
                Invoice No: ${inv.invoiceNo} |
                Date: ${inv.invoiceDate} |
                Supplier: ${inv.supplier?.name ?? '-'} |
                Status: ${inv.status}
              </td>
            </tr>

            <tr>
              <th>Sl</th>
              <th>Material Type</th>
              <th>Material Cost</th>
              <th>Freight</th>
              <th>Import Duty</th>
              <th>Other Charges</th>
              <th>Tax</th>
              <th>Final Cost</th>
            </tr>

            <tr>
              <td class="center">${index + 1}</td>
              <td class="center">${inv.materialTypes}</td>
              <td class="right">${Number(inv.materialCost).toFixed(2)}</td>
              <td class="right">${Number(inv.freightCost).toFixed(2)}</td>
              <td class="right">${Number(inv.importDuty).toFixed(2)}</td>
              <td class="right">${Number(inv.otherCharges).toFixed(2)}</td>
              <td class="right">${Number(inv.taxAmount).toFixed(2)}</td>
              <td class="right">${Number(inv.finalCost).toFixed(2)}</td>
            </tr>
          </table>

          <!-- ITEM DETAILS -->
          <h1>Invoice Details</h1>
          <table class="sub-table">
            <tr>
              <th>Sl</th>
              <th>Product Code</th>
              <th>Type</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Tax</th>
              <th>Total</th>
            </tr>

            ${inv.purchaseInvoiceDetails
              ?.map(
                (item, i) => `
              <tr>
                <td class="center">${i + 1}</td>
                <td>${item.productCode}</td>
                <td>${item.productType}</td>
                <td class="center">${item.size ?? '-'}</td>
                <td class="right">${item.quantity}</td>
                <td class="right">${Number(item.price).toFixed(2)}</td>
                <td class="right">${Number(item.taxAmount).toFixed(2)}</td>
                <td class="right">${Number(item.total).toFixed(2)}</td>
              </tr>
            `,
              )
              .join('')}
          </table>
        `,
          )
          .join('')}

        <table>
          <tr class="totals">
            <td class="right">GRAND TOTAL</td>
            <td class="right">${grandTotal.toFixed(2)}</td>
          </tr>
        </table>

      </body>
    </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      landscape: true,
      margin: { top: 30, bottom: 30, left: 15, right: 15 },
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=Purchase-Invoice-Report-${fromDate}-to-${toDate}.pdf`,
    );

    res.send(pdf);
  }
}
