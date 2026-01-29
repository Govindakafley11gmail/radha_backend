/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class LedgerPDFService {
  async generatePDF(ledgerData: any, res: Response) {
    const { ledger, dateRange, accounts, totals, openingBalance } = ledgerData;
    // console.log('LedgerPDFService -> generatePDF -> ledgerData', ledgerData);
    const startDate = dateRange?.startDate ?? '-';
    const endDate = dateRange?.endDate ?? '-';
    const safeLedgerName = ledger.name?.replace(/[^a-z0-9]/gi, '_') ?? 'Ledger';

    // Calculate closing balance as last account balance
    const closingBalance =
     openingBalance+ accounts && accounts.length ? accounts[accounts.length - 1].balance : 0;

    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 25px; color: #000; }
          h1 { text-align: center; margin-bottom: 5px; font-size: 18px; }
          h3 { text-align: center; margin-bottom: 10px; font-size: 14px; }
          h4 { margin-bottom: 5px; font-size: 13px; }
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
        <h1>LEDGER REPORT</h1>
        <h3>From: ${startDate} To: ${endDate}</h3>
        <h4>Ledger Name: ${ledger.name}</h4>
        <h4>Account Group: ${ledger.group ?? '-'}</h4>
        <h4>Opening Balance: ${Number(ledger.openingBalance ?? 0).toFixed(2)}</h4>

        <table>
          <tr>
            <th>Date</th>
            <th>Narration</th>
            <th>Debit</th>
            <th>Credit</th>
          </tr>

          ${
            (accounts ?? []).length
              ? accounts
                  .map(
                    (e) => `
            <tr>
              <td class="center">${new Date(e.date).toLocaleDateString()}</td>
              <td>${e.particular?? '-'}</td>
              <td class="right">${Number(e.debit ?? 0).toFixed(2)}</td>
              <td class="right">${Number(e.credit ?? 0).toFixed(2)}</td>
            </tr>
          `
                  )
                  .join('')
              : `
            <tr>
              <td colspan="5" class="center">No transactions found</td>
            </tr>
          `
          }

         

          <tr class="totals">
            <td colspan="2">Total</td>
            <td class="right">${Number(totals?.debit ?? 0).toFixed(2)}</td>
            <td class="right">${Number(totals?.credit ?? 0).toFixed(2)}</td>
          </tr>
           <tr class="totals">
            <td colspan="3">Closing Balance</td>
            <td class="right">${Number(closingBalance).toFixed(2)}</td>
          </tr>
        </table>
      </body>
    </html>
    `;

    let browser;
    try {
      browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: 30, bottom: 30 } });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename=Ledger-${safeLedgerName}-${startDate}-to-${endDate}.pdf`,
      );
      res.send(pdf);
    } finally {
      if (browser) await browser.close();
    }
  }
}
