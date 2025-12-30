import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountSchemeDto } from './create-discount-scheme.dto';

export class UpdateDiscountSchemeDto extends PartialType(CreateDiscountSchemeDto) {}
