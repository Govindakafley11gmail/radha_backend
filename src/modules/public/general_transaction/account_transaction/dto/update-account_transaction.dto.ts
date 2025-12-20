import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountTransactionDto } from './create-account_transaction.dto';

export class UpdateAccountTransactionDto extends PartialType(CreateAccountTransactionDto) {}
