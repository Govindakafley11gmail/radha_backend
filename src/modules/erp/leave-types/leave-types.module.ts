import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveTypesService } from './leave-types.service';
import { LeaveTypesController } from './leave-types.controller';
import { LeaveType } from './entities/leave-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveType]), // ✅ Register LeaveType repository here
  ],
  controllers: [LeaveTypesController],
  providers: [LeaveTypesService],
  exports: [LeaveTypesService], // optional if you want to use it elsewhere
})
export class LeaveTypesModule {}
