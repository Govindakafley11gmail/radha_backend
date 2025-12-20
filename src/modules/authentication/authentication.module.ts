// src/authentication/authentication.module.ts
import { Module } from '@nestjs/common';

// Import the modules you want
// import { PermissionModule } from '../permission/permission.module';
// import { RoleModule } from '../role/role.module';
// import { UserModule } from '../user/user.module';
// import { SomeOtherModule } from '../some-other/some-other.module';
import { RolesModule } from './roles/roles.module';
import { PermissionModule } from './permission/permission.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RolesModule, PermissionModule, UsersModule],
})
export class AuthenticationModule {}
