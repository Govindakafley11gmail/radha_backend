/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class PaymentReceiptPDFService {
  async generatePDF(payment: any, res: Response) {
    let browser;

    try {
      const paymentDate = payment?.paymentDate
        ? new Date(payment.paymentDate).toISOString().split('T')[0]
        : '-';

      const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 13px;
              margin: 40px;
              color: #111827;
              line-height: 1.6;
            }

            .header {
              text-align: center;
              margin-bottom: 30px;
            }

            .header h2 {
              margin: 0;
              font-size: 20px;
              text-transform: uppercase;
              border-bottom: 2px solid #000;
              display: inline-block;
              padding-bottom: 5px;
            }

            .meta {
              margin-bottom: 20px;
            }

            .meta div {
              margin-bottom: 5px;
            }

            .section {
              margin-bottom: 20px;
            }

            .subject {
              margin: 20px 0;
              font-weight: bold;
            }

            .body {
              text-align: justify;
            }

            .signature {
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
            }

            .sign-box {
              text-align: center;
              width: 30%;
            }

            .line {
              margin-top: 50px;
              border-top: 1px solid #000;
            }
          </style>
        </head>

        <body>

          <!-- HEADER -->
          <div class="header">
            <h2>Bank Fund Transfer Letter</h2>
          </div>

          <!-- REF + DATE -->
          <div class="meta">
            <div><b>Ref:</b> ${payment?.accountNo ?? 'XXX/DHK/2013'}</div>
            <div><b>Date:</b> ${paymentDate}</div>
          </div>

          <!-- TO SECTION -->
          <div class="section">
            <div><b>To,</b></div>
            <div>The Branch Manager</div>
            <div>${payment?.bankName ?? 'ABC Bank Ltd.'}</div>
            <div>${payment?.branch ?? 'XXX Branch'}</div>
            <div>${payment?.address ?? 'Bhutan'}</div>
          </div>

          <!-- SUBJECT -->
          <div class="subject">
            Sub: Request for fund transfer of ${Number(payment?.payment?.amount ?? 0).toFixed(2)}}
          </div>

          <!-- BODY -->
          <div class="body">
            Dear Sir/Madam,<br/><br/>

            We would like to kindly request you to transfer an amount of 
            <b>${Number(payment?.payment?.amount ?? 0).toFixed(2)}</b> from our account 
             to the beneficiary account.<br/><br/>

            <b>Beneficiary Details:</b><br/>
            Name: ${payment?.supplier?.name ?? '-'}<br/>
            Account No: ${payment?.supplier?.accountNo ?? '-'}<br/>
            Bank: ${payment?.supplier?.bank ?? '-'}<br/><br/>

            Please process this transaction at your earliest convenience.<br/><br/>

            We would appreciate your kind cooperation.<br/><br/>

            Thank you.<br/><br/>
          </div>

          <!-- SIGNATURE -->
          <div class="signature">
            <div class="sign-box">
              <div class="line"></div>
              Prepared By
            </div>

            <div class="sign-box">
              <div class="line"></div>
              Finance Officer
            </div>

            <div class="sign-box">
              <div class="line"></div>
              Authorized Signatory
            </div>
          </div>

        </body>
      </html>
      `;

      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: 30,
          bottom: 30,
          left: 30,
          right: 30,
        },
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename=FundTransfer-Letter-${payment?.accountNo}.pdf`,
      );

      res.send(pdf);
    } catch (error) {
      console.error('PDF Error:', error);
      res.status(500).json({ message: 'Failed to generate letter PDF' });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}