import { PartialType } from '@nestjs/mapped-types';
import { CreateProfitLossAccountDto } from './create-profit-loss-account.dto';

export class UpdateProfitLossAccountDto extends PartialType(CreateProfitLossAccountDto) {}
