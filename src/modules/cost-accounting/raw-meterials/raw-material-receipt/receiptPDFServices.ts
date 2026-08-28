/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class ReceiptPDFService {
  async generatePDF(receiptData: any, res: Response) {
    const receipt = receiptData?.[0] ?? {};
    const supplier = receipt?.supplier ?? {};
    const invoice = receipt?.invoice ?? {};

    const formatDate = (date: any) =>
      date ? new Date(date).toISOString().split('T')[0] : '-';

    const receivedDate = formatDate(receipt?.receivedDate);
    const invoiceDate = formatDate(invoice?.invoiceDate);

    // ✅ TABLE ROWS (NEW STRUCTURE)
    const rows = invoice?.details
      ?.map((item: any, index: number) => {
        const qty = Number(item?.quantity ?? 0);
        const rate = Number(item?.rate ?? 0);
        const value = Number(item?.value ?? 0);
        const freight = Number(item?.freight ?? 0);
        const gst = Number(item?.gst ?? 0);
        const total = Number(item?.total ?? 0);

        return `
        <tr>
          <td class="center">${index + 1}</td>
          <td>${item?.product ?? '-'}</td>
          <td class="center">${item?.code ?? '-'}</td>
          <td class="right">${qty}</td>
          <td class="right">${rate.toFixed(2)}</td>
          <td class="right">${value.toFixed(2)}</td>
          <td class="right">${freight.toFixed(2)}</td>
          <td class="right">0.00</td>
          <td class="right">${gst.toFixed(2)}</td>
          <td class="right total-cell">${total.toFixed(2)}</td>
        </tr>
        `;
      })
      .join('');

    // ✅ GRAND TOTAL
    const grandTotal =
      invoice?.details?.reduce(
        (sum: number, item: any) => sum + Number(item?.total ?? 0),
        0,
      ) ?? 0;

    const html = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 25px;
            color: #333;
          }

          .header {
            text-align: center;
            border-bottom: 3px solid #f97316;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .header h1 {
            margin: 0;
            color: #f97316;
            font-size: 20px;
          }

          .info-grid {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            gap: 20px;
          }

          .card {
            width: 48%;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 10px;
            background: #fff7ed;
          }

          .card h3 {
            margin: 0 0 8px;
            font-size: 13px;
            color: #f97316;
          }

          .card p {
            margin: 3px 0;
            font-size: 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          th {
            background: #f97316;
            color: white;
            padding: 6px;
            border: 1px solid #ddd;
          }

          td {
            border: 1px solid #ddd;
            padding: 6px;
          }

          .center { text-align: center; }
          .right { text-align: right; }

          .total-cell {
            font-weight: bold;
            color: #f97316;
          }

          .summary {
            margin-top: 10px;
            width: 300px;
            float: right;
          }

          .summary td {
            padding: 6px;
            border: 1px solid #ddd;
          }

          .summary .label {
            font-weight: bold;
            background: #fff7ed;
          }

          .summary .value {
            text-align: right;
            font-weight: bold;
            color: #f97316;
          }

          .signature {
            margin-top: 60px;
          }

          .signature table {
            width: 100%;
            border: none;
          }

          .signature td {
            border: none;
            text-align: center;
            padding-top: 40px;
            font-size: 12px;
          }
        </style>
      </head>

      <body>

        <!-- HEADER -->
        <div class="header">
          <h1>RAW MATERIAL RECEIPT (GRN)</h1>
        </div>

        <!-- INFO SECTION -->
        <div class="info-grid">
          <div class="card">
            <h3>Receipt Info</h3>
            <p><b>No:</b> ${receipt?.receiptNo ?? '-'}</p>
            <p><b>Date:</b> ${receivedDate}</p>
            <p><b>Status:</b> Received</p>
            <p><b>Remarks:</b> ${receipt?.remarks ?? '-'}</p>
          </div>

          <div class="card">
            <h3>Supplier Info</h3>
            <p><b>Name:</b> ${supplier?.name ?? '-'}</p>
            <p><b>Phone:</b> ${supplier?.phone ?? '-'}</p>
            <p><b>Email:</b> ${supplier?.email ?? '-'}</p>
          </div>
        </div>

        <div class="info-grid">
          <div class="card">
            <h3>Invoice Info</h3>
            <p><b>No:</b> ${invoice?.invoiceNo ?? '-'}</p>
            <p><b>Date:</b> ${invoiceDate}</p>
            <p><b>Final Cost:</b> ${Number(invoice?.finalCost ?? 0).toFixed(2)}</p>
            <p><b>Tax:</b> ${Number(invoice?.taxAmount ?? 0).toFixed(2)}</p>
          </div>
        </div>

        <!-- TABLE -->
        <table>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Code</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Value</th>
            <th>Freight</th>
            <th>Duty</th>
            <th>GST</th>
            <th>Total</th>
          </tr>
          ${rows}
        </table>

        <!-- TOTAL -->
        <table class="summary">
          <tr>
            <td class="label">Grand Total</td>
            <td class="value">${grandTotal.toFixed(2)}</td>
          </tr>
        </table>

        <!-- SIGNATURE -->
        <div class="signature">
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

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 20, bottom: 20 },
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=GRN-${receipt?.receiptId}.pdf`,
    );

    res.send(pdf);
  }
}