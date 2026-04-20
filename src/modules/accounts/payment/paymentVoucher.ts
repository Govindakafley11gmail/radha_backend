/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class PaymentVoucherPDFService {
  
  // ================= AMOUNT IN WORDS =================
  private numberToWords(num: number): string {
    if (!num) return 'Zero';

    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
      'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred ' + (n % 100 ? inWords(n % 100) : '');
      if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand ' + (n % 1000 ? inWords(n % 1000) : '');
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh ' + (n % 100000 ? inWords(n % 100000) : '');
      return inWords(Math.floor(n / 10000000)) + ' Crore ' + (n % 10000000 ? inWords(n % 10000000) : '');
    };

    return inWords(Math.floor(num)) + ' Only';
  }

  async generatePDF(payment: any, res: Response) {
    let browser;

    try {
      const paymentDate = payment?.paymentDate
        ? new Date(payment.paymentDate).toISOString().split('T')[0]
        : '-';

      const amount = Number(payment?.payment?.amount ?? 0);
      const amountWords = this.numberToWords(amount);

      // ================= HTML =================
     const html = `
<html>
<head>
<style>
  body {
    font-family: "Segoe UI", Arial, sans-serif;
    margin: 20px;
    font-size: 12px;
    color: #333;
  }

  /* HEADER */
  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 3px solid #4f46e5;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }

  .company {
    font-size: 18px;
    font-weight: bold;
    color: #4f46e5;
  }

  .company-details {
    font-size: 11px;
    color: #555;
  }

  .voucher-title {
    text-align: right;
  }

  .voucher-title h2 {
    margin: 0;
    color: #111827;
  }

  .badge {
    display: inline-block;
    background: #4f46e5;
    color: #fff;
    padding: 3px 10px;
    font-size: 11px;
    border-radius: 4px;
    margin-top: 4px;
  }

  /* INFO TABLE */
  .info-table {
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
  }

  .info-table td {
    padding: 6px;
  }

  .label {
    font-weight: 600;
    color: #111827;
  }

  /* MAIN TABLE */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }

  th {
    background: #4f46e5;
    color: #fff;
    padding: 8px;
    text-align: left;
    font-size: 12px;
  }

  td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  tr:nth-child(even) {
    background: #f9fafb;
  }

  .right {
    text-align: right;
  }

  /* TOTAL */
  .total-row td {
    background: #eef2ff;
    font-weight: bold;
  }

  /* AMOUNT BOX */
  .amount-box {
    margin-top: 15px;
    padding: 10px;
    border: 1px dashed #4f46e5;
    background: #f5f7ff;
  }

  /* NARRATION */
  .narration {
    margin-top: 15px;
    padding: 10px;
    border: 1px solid #ddd;
    background: #fafafa;
    min-height: 60px;
  }

  /* FOOTER */
  .footer {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }

  .sign {
    text-align: center;
    width: 22%;
  }

  .line {
    margin-top: 40px;
    border-top: 1px solid #333;
  }

</style>
</head>

<body>

  <!-- HEADER -->
  <div class="header">
    <div>
      <div class="company">Raddha Pvt. Ltd.</div>
      <div class="company-details">
        Samtse, Bhutan <br/>
        Phone: +975-XXXXXXX
      </div>
    </div>

    <div class="voucher-title">
      <h2>PAYMENT VOUCHER</h2>
      <div class="badge">Approved</div>
    </div>
  </div>

  <!-- BASIC INFO -->
  <table class="info-table">
    <tr>
      <td><span class="label">Voucher No:</span> ${payment?.accountNo ?? '-'}</td>
      <td class="right"><span class="label">Date:</span> ${paymentDate}</td>
    </tr>
    <tr>
      <td><span class="label">Paid To:</span> ${payment?.supplier?.name ?? '-'}</td>
      <td class="right"><span class="label">Payment Mode:</span> ${payment?.payment?.mode ?? '-'}</td>
    </tr>
  </table>

  <!-- ACCOUNT TABLE -->
  <table>
    <thead>
      <tr>
        <th>Account Head</th>
        <th>Description</th>
        <th class="right">Debit</th>
        <th class="right">Credit</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>Expense Account</td>
        <td>${payment?.payment?.description ?? '-'}</td>
        <td class="right">${amount.toFixed(2)}</td>
        <td class="right">0.00</td>
      </tr>

      <tr>
        <td>Cash / Bank</td>
        <td>${payment?.payment?.mode ?? '-'}</td>
        <td class="right">0.00</td>
        <td class="right">${amount.toFixed(2)}</td>
      </tr>

      <tr class="total-row">
        <td colspan="2">TOTAL</td>
        <td class="right">${amount.toFixed(2)}</td>
        <td class="right">${amount.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <!-- AMOUNT IN WORDS -->
  <div class="amount-box">
    <b>Amount in Words:</b> ${amountWords}
  </div>

  <!-- NARRATION -->
  <div class="narration">
    <b>Narration:</b><br/>
    Payment made to ${payment?.supplier?.name ?? '-'} 
    for invoice ${payment?.invoice?.invoiceNo ?? '-'}.
  </div>

  <!-- SIGNATURE -->
  <div class="footer">
    <div class="sign">
      <div class="line"></div>
      Prepared By
    </div>

    <div class="sign">
      <div class="line"></div>
      Checked By
    </div>

    <div class="sign">
      <div class="line"></div>
      Approved By
    </div>

    <div class="sign">
      <div class="line"></div>
      Received By
    </div>
  </div>

</body>
</html>
`;

      // ================= PUPPETEER =================
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: 20, bottom: 20 },
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename=PaymentVoucher-${payment?.accountNo}.pdf`,
      );

      res.send(pdf);

    } catch (error) {
      console.error('PDF Error:', error);
      res.status(500).json({ message: 'Failed to generate voucher' });

    } finally {
      if (browser) await browser.close();
    }
  }
}