import { PartialType } from '@nestjs/mapped-types';
import { CreateTrialbalanceDto } from './create-trialbalance.dto';

export class UpdateTrialbalanceDto extends PartialType(CreateTrialbalanceDto) {}
