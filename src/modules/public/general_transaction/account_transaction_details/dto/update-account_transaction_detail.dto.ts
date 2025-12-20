import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountTransactionDetailDto } from './create-account_transaction_detail.dto';

export class UpdateAccountTransactionDetailDto extends PartialType(CreateAccountTransactionDetailDto) {}
