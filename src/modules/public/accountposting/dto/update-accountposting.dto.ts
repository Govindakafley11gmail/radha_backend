import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountpostingDto } from './create-accountposting.dto';

export class UpdateAccountpostingDto extends PartialType(CreateAccountpostingDto) {}
