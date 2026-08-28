/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class ReceiptPDFService {
  async generatePDF(paymentData: any, res: Response) {
    // ✅ SINGLE OBJECT DATA
    const payment = paymentData ?? {};

    const formatDate = (date: any) =>
      date ? new Date(date).toISOString().split('T')[0] : '-';

    const paymentDate = formatDate(payment?.paymentDate);
    const createdAt = formatDate(payment?.createdAt);

    const amount = Number(payment?.amount ?? 0);

    // ✅ HTML TEMPLATE
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
            border-bottom: 3px solid #16a34a;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .header h1 {
            margin: 0;
            color: #16a34a;
            font-size: 22px;
          }

          .card {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 16px;
            background: #f0fdf4;
            margin-bottom: 20px;
          }

          .card h3 {
            margin: 0 0 12px;
            font-size: 15px;
            color: #16a34a;
          }

          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 13px;
          }

          .label {
            font-weight: bold;
            color: #374151;
          }

          .value {
            color: #111827;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }

          th {
            background: #16a34a;
            color: white;
            padding: 10px;
            border: 1px solid #ddd;
          }

          td {
            border: 1px solid #ddd;
            padding: 10px;
          }

          .right {
            text-align: right;
          }

          .center {
            text-align: center;
          }

          .amount {
            font-weight: bold;
            color: #16a34a;
          }

          .summary {
            margin-top: 20px;
            width: 320px;
            float: right;
          }

          .summary td {
            padding: 10px;
            border: 1px solid #ddd;
          }

          .summary .label {
            background: #f0fdf4;
            font-weight: bold;
          }

          .summary .value {
            text-align: right;
            font-weight: bold;
            color: #16a34a;
          }

          .footer {
            margin-top: 100px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }

          .signature {
            margin-top: 70px;
          }

          .signature table {
            width: 100%;
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
          <h1>ASSET PAYMENT RECEIPT</h1>
        </div>

        <!-- PAYMENT INFO -->
        <div class="card">
          <h3>Payment Details</h3>
          <div class="info-row">
            <span class="label">Payment Date:</span>
            <span class="value">${paymentDate}</span>
          </div>

          <div class="info-row">
            <span class="label">Created At:</span>
            <span class="value">${createdAt}</span>
          </div>

          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value">${payment?.status ?? '-'}</span>
          </div>

          <div class="info-row">
            <span class="label">Payment Mode:</span>
            <span class="value">${payment?.paymentMode ?? '-'}</span>
          </div>

          <div class="info-row">
            <span class="label">Cheque Number:</span>
            <span class="value">${payment?.chequeNumber ?? '-'}</span>
          </div>

          <div class="info-row">
            <span class="label">Description:</span>
            <span class="value">${payment?.description ?? '-'}</span>
          </div>
        </div>

        <!-- PAYMENT TABLE -->
        <table>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Status</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>

          <tr>
            <td class="center">1</td>
            <td>${payment?.description ?? '-'}</td>
            <td class="center">${payment?.status ?? '-'}</td>
            <td class="center">${paymentDate}</td>
            <td class="right amount">${amount.toFixed(2)}</td>
          </tr>
        </table>

        <!-- TOTAL -->
        <table class="summary">
          <tr>
            <td class="label">Total Amount</td>
            <td class="value">${amount.toFixed(2)}</td>
          </tr>
        </table>

        <!-- SIGNATURE -->
        <div class="signature">
          <table>
            <tr>
              <td>Prepared By</td>
              <td>Verified By</td>
              <td>Approved By</td>
            </tr>

            <tr>
              <td>___________________</td>
              <td>___________________</td>
              <td>___________________</td>
            </tr>
          </table>
        </div>

        <!-- FOOTER -->
        <div class="footer">
          Generated on ${createdAt}
        </div>

      </body>
    </html>
    `;

    // ✅ LAUNCH BROWSER
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // ✅ GENERATE PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px',
      },
    });

    await browser.close();

    // ✅ RESPONSE HEADERS
    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader(
      'Content-Disposition',
      `inline; filename=Asset-Payment-${payment?.id}.pdf`,
    );

    res.send(pdf);
  }
}