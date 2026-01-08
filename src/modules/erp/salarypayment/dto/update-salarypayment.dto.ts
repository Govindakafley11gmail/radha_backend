import { PartialType } from '@nestjs/mapped-types';
import { CreateSalarypaymentDto } from './create-salarypayment.dto';

export class UpdateSalarypaymentDto extends PartialType(CreateSalarypaymentDto) {}
