/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Controller, Post, Body, Res } from '@nestjs/common';
import { TrialService } from './trialbalance.service';
import { CreateTrialbalanceDto } from './dto/create-trialbalance.dto';
import type { Response } from 'express';
import { TrialBalancePDFService } from './trialbalancepdfservices';

@Controller('trialbalance')
export class TrialbalanceController {
  constructor(
    private readonly trialService: TrialService,
    private readonly pdfService: TrialBalancePDFService,
  ) {}

  @Post()
  async getTrialBalancePDF(
    @Body() filter: CreateTrialbalanceDto,
    @Res() res: Response,
  ) {
    const { startDate, endDate } = filter;

    // 1️⃣ Generate trial balance data
    const trialData = await this.trialService.generateTrialBalance(startDate, endDate);

    // 2️⃣ Generate PDF and send response
    await this.pdfService.generatePDF(trialData, res);
  }
}
