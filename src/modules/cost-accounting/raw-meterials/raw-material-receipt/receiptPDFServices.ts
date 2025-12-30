/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class ReceiptPDFService {
  async generatePDF(receipt: any, res: Response) {
    // ===== Supplier and Invoice Info =====
    const supplier = receipt.supplier ?? {};
    const invoice = receipt.purchaseInvoice ?? {};
    const invoiceDetails = invoice.purchaseInvoiceDetails ?? [];

    // ===== Dates =====
    const receivedDate = receipt.receivedDate
      ? new Date(receipt.receivedDate).toISOString().split('T')[0]
      : '-';

    // ===== Material Details Rows =====
    let materialRows = '';
    invoiceDetails.forEach((item: any, index: number) => {
      const name = item.productType ?? '-';
      const unit = item.size ?? '-';
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price || 0);
      const total = Number(item.total || quantity * price);
      const rowColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff';
      materialRows += `
        <tr style="background-color:${rowColor}">
          <td>${name}</td>
          <td>${unit}</td>
          <td class="right">${quantity.toFixed(2)}</td>
          <td class="right">${price.toFixed(2)}</td>
          <td class="right">${total.toFixed(2)}</td>
        </tr>
      `;
    });

    if (!materialRows) {
      materialRows = `<tr><td colspan="5" style="text-align:center">No material details available</td></tr>`;
    }

    const freightCost = Number(receipt.freightCost || 0);
    const importDuty = Number(receipt.importDuty || 0);
    const scrapQty = Number(receipt.scrapQuantity || 0);
    const totalAmount = invoiceDetails.reduce(
      (acc, item) => acc + Number(item.total || 0),
      0
    );
    const grandTotal = totalAmount + freightCost + importDuty;

    // ===== HTML Template =====
    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #333; }
          h1 { text-align: center; color: #2c3e50; margin-bottom: 5px; }
          h3 { margin-top: 15px; color: #2c3e50; margin-bottom: 5px; font-size: 14px; }
          .section { border: 1px solid #ddd; border-radius: 6px; padding: 10px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 6px; }
          th { background-color: #2c3e50; color: #fff; text-align: left; font-size: 12px; }
          .right { text-align: right; }
          .signature { margin-top: 50px; }
          .signature td { padding-top: 40px; }
          .columns { display: flex; gap: 10px; }
          .column { flex: 1; }
          .table-header { background-color: #f1f1f1; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>RAW MATERIAL RECEIPT (GRN)</h1>

        <div class="section">
          <h3>Receipt Information</h3>
          <table>
            <tr><td>Receipt ID</td><td>${receipt.id}</td></tr>
            <tr><td>Received Date</td><td>${receivedDate}</td></tr>
            <tr><td>Status</td><td>Received</td></tr>
          </table>
        </div>

        <div class="section">
          <h3>Supplier Information</h3>
          <table>
            <tr><td>Name</td><td>${supplier.name ?? '-'}</td></tr>
            <tr><td>Phone</td><td>${supplier.phone_no ?? '-'}</td></tr>
            <tr><td>Email</td><td>${supplier.email ?? '-'}</td></tr>
          </table>
        </div>

        <div class="columns">
          <div class="column section">
            <h3>Current Bins</h3>
            <table>
              <tr>
                <th>Bin</th>
                <th>Date Code</th>
                <th>Lot Code</th>
                <th>Quantity</th>
              </tr>
              <tr>
                <td>NEW</td>
                <td>${receivedDate}</td>
                <td>Lot123</td>
                <td class="right">10</td>
              </tr>
            </table>
          </div>

          <div class="column section">
            <h3>Material Details</h3>
            <table>
              <tr>
                <th>Material</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Unit Cost</th>
                <th>Total</th>
              </tr>
              ${materialRows}
              <tr class="table-header">
                <td colspan="2" class="right">Total</td>
                <td class="right">${invoiceDetails.reduce((acc, item) => acc + item.quantity || 0)}</td>
                <td></td>
                <td class="right">${totalAmount.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div class="column section">
            <h3>Cost Breakdown</h3>
            <table>
              <tr><td>Freight Cost</td><td class="right">${freightCost.toFixed(2)}</td></tr>
              <tr><td>Import Duty</td><td class="right">${importDuty.toFixed(2)}</td></tr>
              <tr><td>Scrap Quantity</td><td class="right">${scrapQty}</td></tr>
              <tr><th>Grand Total</th><th class="right">${grandTotal.toFixed(2)}</th></tr>
            </table>
          </div>
        </div>

        <div class="signature">
          <table style="width:100%;">
            <tr>
              <td>Received By</td>
              <td>Checked By</td>
              <td>Approved By</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
      </body>
    </html>
    `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 40, bottom: 40 },
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=RawMaterialReceipt-${receipt.id}.pdf`,
    );
    res.send(pdf);
  }
}
