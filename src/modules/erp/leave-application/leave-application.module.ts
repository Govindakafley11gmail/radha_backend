import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveApplicationService } from './leave-application.service';
import { LeaveApplicationController } from './leave-application.controller';
import { LeaveApplication } from './entities/leave-application.entity';
import { LeaveType } from '../leave-types/entities/leave-type.entity';
import { User } from 'src/modules/authentication/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LeaveApplication, // ✅ Register repository
      User,             // ✅ Register repository
      LeaveType,        // ✅ Register repository
    ]),
  ],
  controllers: [LeaveApplicationController],
  providers: [LeaveApplicationService],
})
export class LeaveApplicationModule {}
