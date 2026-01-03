import { Module } from '@nestjs/common';
import { BranchesModule } from './branches/branches.module';
import { DepartmentsModule } from './department/department.module';
import { AccountGroupModule } from './account_group/account_group.module';
import { AccountTypesModule } from './account_types/account_types.module';

@Module({
  imports: [BranchesModule, DepartmentsModule, AccountGroupModule, AccountTypesModule]
})
export class MasterModule {}
