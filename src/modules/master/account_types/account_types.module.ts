import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from 'src/common/response/response';
import { AccountGroup } from '../account_group/entities/account_group.entity';
import { AccountTypeController } from './account_types.controller';
import { AccountTypeService } from './account_types.service';
import { AccountType } from './entities/account_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountType, AccountGroup])],
  controllers: [AccountTypeController],
  providers: [AccountTypeService, ResponseService],
})
export class AccountTypesModule {}
