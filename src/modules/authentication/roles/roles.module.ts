import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from './entities/role.entity';
import { ResponseService } from 'src/common/response/response';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]), // ✅ registers RoleRepository & PermissionRepository
  ],
  controllers: [RolesController],
  providers: [RolesService,ResponseService],
  exports: [RolesService], // optional if used in other modules

})
export class RolesModule { }
