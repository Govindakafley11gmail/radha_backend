/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class ReceiptPDFService {
  async generatePDF(receipt: any, res: Response) {
    // Convert string amounts to numbers
    const amountReceived = parseFloat(receipt.amount_received || '0');

    // Format dates
    const receiptDate = receipt.receipt_date instanceof Date
      ? receipt.receipt_date.toISOString().split('T')[0]
      : receipt.receipt_date;

    const invoiceDate = receipt.salesInvoice?.invoiceDate
      ? new Date(receipt.salesInvoice.invoiceDate).toISOString().split('T')[0]
      : '-';

    const dueDate = receipt.salesInvoice?.dueDate
      ? new Date(receipt.salesInvoice.dueDate).toISOString().split('T')[0]
      : '-';

    // Customer info
    const customer = receipt.customer ?? {};
    const customerName = customer.name ?? '-';
    const customerId = customer.customer_id ?? '-';
    const customerAddress = customer.address ?? '-';
    const customerEmail = customer.email ?? '-';
    const customerPhone = customer.phone_no ?? '-';

    // Invoice info
    const invoice = receipt.salesInvoice ?? {};
    const invoiceNumber = invoice.invoiceNumber ?? '-';
    const invoiceTotal = parseFloat(invoice.totalAmount || '0');
    const invoiceTax = parseFloat(invoice.taxAmount || '0');
    const invoiceStatus = invoice.status ?? '-';

    // Invoice line items (if available)
    const items = invoice.details ?? [];

    // HTML content
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { text-align: center; color: #4a4a4a; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 8px; border: 1px solid #ddd; }
            th { background-color: #f0f0f0; }
            .right { text-align: right; }
            .signature { margin-top: 60px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>Money Receipt</h1>

          <h3>Receipt Info</h3>
          <table>
            <tr><td>Receipt No</td><td>${receipt.receipt_number}</td></tr>
            <tr><td>Receipt Date</td><td>${receiptDate}</td></tr>
            <tr><td>Payment Method</td><td>${receipt.payment_method}</td></tr>
            <tr><td>Amount Received</td><td>${amountReceived.toFixed(2)}</td></tr>
            <tr><td>Status</td><td>${receipt.status}</td></tr>
          </table>

          <h3>Customer Info</h3>
          <table>
            <tr><td>Name</td><td>${customerName}</td></tr>
            <tr><td>ID</td><td>${customerId}</td></tr>
            <tr><td>Address</td><td>${customerAddress}</td></tr>
            <tr><td>Email</td><td>${customerEmail}</td></tr>
            <tr><td>Phone</td><td>${customerPhone}</td></tr>
          </table>

          <h3>Invoice Info</h3>
          <table>
            <tr><td>Invoice Number</td><td>${invoiceNumber}</td></tr>
            <tr><td>Invoice Date</td><td>${invoiceDate}</td></tr>
            <tr><td>Due Date</td><td>${dueDate}</td></tr>
            <tr><td>Total Amount</td><td>${invoiceTotal.toFixed(2)}</td></tr>
            <tr><td>Tax Amount</td><td>${invoiceTax.toFixed(2)}</td></tr>
            <tr><td>Status</td><td>${invoiceStatus}</td></tr>
          </table>

          ${items.length > 0 ? `
            <h3>Invoice Items</h3>
            <table>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
              ${items.map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${item.description ?? '-'}</td>
                  <td class="right">${item.quantity ?? 0}</td>
                  <td class="right">${parseFloat(item.unitPrice ?? '0').toFixed(2)}</td>
                  <td class="right">${parseFloat(item.total ?? '0').toFixed(2)}</td>
                </tr>
              `).join('')}
            </table>
          ` : ''}

          <div class="signature">
            __________________________<br/>
            Authorized Signature
          </div>
        </body>
      </html>
    `;

    // Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: 40, bottom: 40 } });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${receipt.receipt_number}.pdf`);
    res.send(pdfBuffer);
  }
}
