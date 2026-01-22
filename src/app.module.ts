/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from './common/token';
import { PermissionModule } from './modules/authentication/permission/permission.module';
import { RolesModule } from './modules/authentication/roles/roles.module';
import { UsersModule } from './modules/authentication/users/users.module';
import { GeneralTransactionModule } from './modules/public/general_transaction/general_transaction.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { MasterModule } from './modules/master/master.module';
import { AccountReceivableModule } from './modules/account_receivable/account_receivable.module';
import { TaxationComplianceModule } from './modules/taxation-compliance/taxation-compliance.module';
import { SalesRevenueModule } from './modules/sales-revenue/sales-revenue.module';
import { CostAccountingModule } from './modules/cost-accounting/cost-accounting.module';
import { InventoryManagementModule } from './modules/inventory-management/inventory-management.module';
import { ErpModule } from './modules/erp/erp.module';
import { ReportsModule } from './modules/reports/reports.module';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'mydb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ACCESS_SECRET',
      signOptions: { expiresIn: '15m' },
    }),

    AuthenticationModule,
    UsersModule,
    RolesModule,
    PermissionModule,
    GeneralTransactionModule,
    AccountsModule,
    MasterModule,
    AccountReceivableModule,
    TaxationComplianceModule,
    SalesRevenueModule,
    CostAccountingModule,
    InventoryManagementModule,
    ErpModule,
    ReportsModule
    
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (jwtService: JwtService, reflector: Reflector) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return new JwtAuthGuard(jwtService, reflector);
      },
      inject: [JwtService, Reflector], // ✅ inject JwtService, not JwtModule
    },
  ],
})
export class AppModule {}
