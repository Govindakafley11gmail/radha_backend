import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxmasterDto } from './create-taxmaster.dto';

export class UpdateTaxmasterDto extends PartialType(CreateTaxmasterDto) {}
