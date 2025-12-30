import { PartialType } from '@nestjs/mapped-types';
import { CreateBadDebtDto } from './create-bad-debt.dto';

export class UpdateBadDebtDto extends PartialType(CreateBadDebtDto) {}
