/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class LedgerExcelService {
  async generateExcel(ledgerData: any, res: Response) {
    const { ledger, dateRange, accounts, totals } = ledgerData;
    const startDate = dateRange?.startDate ?? '-';
    const endDate = dateRange?.endDate ?? '-';

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Ledger Report');

    // Header rows
    sheet.addRow(['LEDGER REPORT']);
    sheet.addRow([`From: ${startDate} To: ${endDate}`]);
    sheet.addRow([`Ledger Name: ${ledger.name}`]);
    sheet.addRow([`Account Group: ${ledger.group ?? '-'}`]);
    sheet.addRow([`Opening Balance: ${ledger.openingBalance ?? 0}`]);
    sheet.addRow([]); // empty row

    // Table headers
    sheet.addRow(['Date', 'Particular', 'Debit', 'Credit', 'Balance']);

    // Add transactions
    (accounts ?? []).forEach((e: any) => {
      sheet.addRow([
        new Date(e.date).toLocaleDateString(),
        e.particular ?? '-',
        e.debit ?? 0,
        e.credit ?? 0,
        e.balance ?? 0,
      ]);
    });

    // Closing balance
    const closingBalance =
      accounts && accounts.length ? accounts[accounts.length - 1].balance : 0;
    sheet.addRow([]);
    sheet.addRow(['', '', '', 'Closing Balance', closingBalance]);

    // Totals
    sheet.addRow([
      '',
      'Totals',
      totals?.debit ?? 0,
      totals?.credit ?? 0,
      '',
    ]);

    // Format numbers
    sheet.columns.forEach((col, idx) => {
      if (idx >= 2) col.numFmt = '#,##0.00';
    });

    // Highlight negative balances in red
    sheet.eachRow((row) => {
      const balanceCell = row.getCell(5);
      if (balanceCell.value && Number(balanceCell.value) < 0) {
        balanceCell.font = { color: { argb: 'FFFF0000' }, bold: true };
      }
    });

    // Send Excel file
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Ledger-${ledger.name.replace(
        /[^a-z0-9]/gi,
        '_',
      )}-${startDate}-to-${endDate}.xlsx`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
