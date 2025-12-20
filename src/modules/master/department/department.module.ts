import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Branch } from '../branches/entities/branch.entity';
import { ResponseService } from 'src/common/response/response';
import { DepartmentsController } from './department.controller';
import { DepartmentsService } from './department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Branch])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, ResponseService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
