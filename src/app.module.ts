import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import * as dotenv from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/token';

import { AuthenticationModule } from './modules/authentication/authentication.module';
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
import { FixedAssetModule } from './modules/fixed-asset/fixed-asset.module';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

@Module({
  imports: [
    ScheduleModule.forRoot(), // required for @Cron to work

    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(databaseUrl
        ? { url: databaseUrl }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'mydb',
          }),
      autoLoadEntities: true,
      // Set SYNC_DB=true only for the very first deploy to create tables, then remove it
      synchronize: !isProd || process.env.SYNC_DB === 'true',
      ssl: databaseUrl ? { rejectUnauthorized: false } : false,
      extra: { max: 10 },
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
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
    ReportsModule,
    FixedAssetModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (jwtService: JwtService, reflector: Reflector) =>
        new JwtAuthGuard(jwtService, reflector),
      inject: [JwtService, Reflector],
    },
  ],
})
export class AppModule {}