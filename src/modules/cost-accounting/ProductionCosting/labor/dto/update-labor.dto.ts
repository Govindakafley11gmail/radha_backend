import { PartialType } from '@nestjs/mapped-types';
import { CreateLaborDto } from './create-labor.dto';

export class UpdateLaborDto extends PartialType(CreateLaborDto) {}
