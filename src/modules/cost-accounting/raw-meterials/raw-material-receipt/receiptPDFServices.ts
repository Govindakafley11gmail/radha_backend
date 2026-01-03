/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class ReceiptPDFService {
  async generatePDF(receipt: any, res: Response) {
    // ===============================
    // SAFE DATA EXTRACTION
    // ===============================
    const supplier = receipt?.supplier ?? {};
    const material = receipt?.rawMaterial ?? {};

    const receivedDate = receipt?.receivedDate
      ? new Date(receipt.receivedDate).toISOString().split('T')[0]
      : '-';

    const quantityReceived = Number(receipt?.quantityReceived ?? 0);
    const unitCost = Number(material?.standard_cost ?? 0);
    const totalUnitCost = Number(receipt?.total_unit_cost ?? 0);

    const freightCost = Number(receipt?.freightCost ?? 0);
    const importDuty = Number(receipt?.importDuty ?? 0);
    const gstTax = Number(receipt?.gst_tax_amount ?? 0);
    const grandTotal = Number(receipt?.totalCost ?? 0);

    // ===============================
    // HTML TEMPLATE
    // ===============================
    const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 25px;
            color: #000;
          }

          h1 {
            text-align: center;
            margin-bottom: 5px;
            font-size: 18px;
          }

          .section {
            border: 1px solid #000;
            padding: 8px;
            margin-bottom: 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          th, td {
            border: 1px solid #000;
            padding: 5px;
          }

          th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }

          td {
            vertical-align: middle;
          }

          .right {
            text-align: right;
          }

          .center {
            text-align: center;
          }

          .signature td {
            border: none;
            padding-top: 40px;
            text-align: center;
          }
        </style>
      </head>

      <body>
        <h1>RAW MATERIAL RECEIPT (GRN)</h1>

        <!-- RECEIPT INFO -->
        <div class="section">
          <table>
            <tr>
              <td><b>Receipt No</b></td>
              <td>${receipt?.receipt_no ?? '-'}</td>
              <td><b>Received Date</b></td>
              <td>${receivedDate}</td>
            </tr>
            <tr>
              <td><b>Status</b></td>
              <td colspan="3">Received</td>
            </tr>
          </table>
        </div>

        <!-- SUPPLIER INFO -->
        <div class="section">
          <table>
            <tr>
              <td><b>Supplier Name</b></td>
              <td>${supplier?.name ?? '-'}</td>
              <td><b>Phone</b></td>
              <td>${supplier?.phone_no ?? '-'}</td>
            </tr>
            <tr>
              <td><b>Email</b></td>
              <td colspan="3">${supplier?.email ?? '-'}</td>
            </tr>
          </table>
        </div>

        <!-- MATERIAL TABLE (ONE ROW LIKE IMAGE) -->
        <div class="section">
          <table>
            <tr>
              <th>Product Code</th>
              <th>Description</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Value</th>
              <th>Freight</th>
              <th>Import Duty</th>
              <th>GST</th>
              <th>Total</th>
            </tr>

            <tr>
              <td class="center">${material?.id ?? '-'}</td>
              <td>${material?.name ?? '-'}</td>
              <td class="center">${material?.unit ?? '-'}</td>
              <td class="right">${quantityReceived}</td>
              <td class="right">${unitCost.toFixed(2)}</td>
              <td class="right">${totalUnitCost.toFixed(2)}</td>
              <td class="right">${freightCost.toFixed(2)}</td>
              <td class="right">${importDuty.toFixed(2)}</td>
              <td class="right">${gstTax.toFixed(2)}</td>
              <td class="right">${grandTotal.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <!-- SIGNATURE -->
        <div class="section signature">
          <table>
            <tr>
              <td>Received By</td>
              <td>Checked By</td>
              <td>Approved By</td>
            </tr>
            <tr>
              <td>___________________</td>
              <td>___________________</td>
              <td>___________________</td>
            </tr>
          </table>
        </div>
      </body>
    </html>
    `;

    // ===============================
    // PDF GENERATION
    // ===============================
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 30, bottom: 30 },
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
