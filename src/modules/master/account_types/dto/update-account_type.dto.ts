import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountTypeDto } from './create-account_type.dto';

export class UpdateAccountTypeDto extends PartialType(CreateAccountTypeDto) {}
