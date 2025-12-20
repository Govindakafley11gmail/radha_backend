import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from 'src/common/response/response';
import { AccountGroupController } from './account_group.controller';
import { AccountGroupService } from './account_group.service';
import { AccountGroup } from './entities/account_group.entity';
import { AccountType } from '../account_types/entities/account_type.entity'; // import AccountType

@Module({
  imports: [TypeOrmModule.forFeature([AccountGroup, AccountType])],
  controllers: [AccountGroupController],
  providers: [AccountGroupService, ResponseService],
  exports: [AccountGroupService],
})
export class AccountGroupModule {}
