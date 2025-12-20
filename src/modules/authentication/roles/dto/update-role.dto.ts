import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
