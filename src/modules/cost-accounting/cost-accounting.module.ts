import { Module } from '@nestjs/common';
import { ProductionBatchModule } from './ProductionCosting/production-batch/production-batch.module';
import { MachineModule } from './ProductionCosting/machine/machine.module';
import { MachineCostModule } from './ProductionCosting/machine-cost/machine-cost.module';
import { LaborModule } from './ProductionCosting/labor/labor.module';
import { LaborCostModule } from './ProductionCosting/labor-cost/labor-cost.module';
import { OtherProductionCostModule } from './ProductionCosting/other-production-cost/other-production-cost.module';
import { ProductUnitCostModule } from './ProductionCosting/product-unit-cost/product-unit-cost.module';
import { RawMaterialModule } from './raw-meterials/raw-material/raw-material.module';
import { RawMaterialCostModule } from './raw-meterials/raw-material-cost/raw-material-cost.module';
import { RawMaterialReceiptModule } from './raw-meterials/raw-material-receipt/raw-material-receipt.module';

@Module({
  imports: [RawMaterialModule,RawMaterialCostModule,RawMaterialReceiptModule, ProductionBatchModule, MachineModule, MachineCostModule, LaborModule, LaborCostModule, OtherProductionCostModule, ProductUnitCostModule],
})
export class CostAccountingModule {}
