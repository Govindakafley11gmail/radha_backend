import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { Branch } from './entities/branch.entity';
import { ResponseService } from 'src/common/response/response';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch]), // ✅ repository injection
  ],
  controllers: [BranchesController],
  providers: [
    BranchesService,
    ResponseService, // ✅ required for controller
  ],
  exports: [BranchesService],
})
export class BranchesModule {}
