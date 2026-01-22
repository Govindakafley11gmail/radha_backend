/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class TrialBalancePDFService {
  async generatePDF(trialData: any, res: Response) {
    const { dateRange, accounts, totals } = trialData;

    const startDate = dateRange?.startDate ?? '-';
    const endDate = dateRange?.endDate ?? '-';

    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 25px; color: #000; }
          h1 { text-align: center; margin-bottom: 10px; font-size: 18px; }
          h3 { text-align: center; margin-bottom: 20px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #000; padding: 5px; }
          th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
          td { vertical-align: middle; }
          .right { text-align: right; }
          .center { text-align: center; }
          .totals { font-weight: bold; background-color: #e0e0e0; }
        </style>
      </head>
      <body>
        <h1>TRIAL BALANCE REPORT</h1>
        <h3>From: ${startDate} To: ${endDate}</h3>

        <table>
          <tr>
            <th>Account Name</th>
            <th>Debit</th>
            <th>Credit</th>
          </tr>
          ${accounts
            .map(
              (a) => `
            <tr>
              <td>${a.accountName}</td>
              <td class="right">${a.debit.toFixed(2)}</td>
              <td class="right">${a.credit.toFixed(2)}</td>
            </tr>
          `,
            )
            .join('')}
          <tr class="totals">
            <td>Total</td>
            <td class="right">${totals?.debit.toFixed(2)}</td>
            <td class="right">${totals?.credit.toFixed(2)}</td>
          </tr>
        </table>
      </body>
    </html>
    `;

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
      `inline; filename=TrialBalance-${startDate}-to-${endDate}.pdf`,
    );

    res.send(pdf);
  }
}
