import { IsOptional, IsString } from 'class-validator';

export class CreateTrialbalanceDto {
  /**
   * Optional start date for the trial balance period
   * Format: YYYY-MM-DD
   */
  @IsOptional()
  @IsString()
  startDate?: string;

  /**
   * Optional end date for the trial balance period
   * Format: YYYY-MM-DD
   */
  @IsOptional()
  @IsString()
  endDate?: string;
}
