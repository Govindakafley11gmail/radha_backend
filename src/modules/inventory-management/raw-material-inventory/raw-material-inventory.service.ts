/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  RawMaterialInventory,
  ValuationMethod,
} from './entities/raw-material-inventory.entity';
import { RawMaterialReceipt } from 'src/modules/cost-accounting/raw-meterials/raw-material-receipt/entities/raw-material-receipt.entity';

@Injectable()
export class RawMaterialInventoryService {
  constructor(
    @InjectRepository(RawMaterialInventory)
    private inventoryRepo: Repository<RawMaterialInventory>,

    @InjectRepository(RawMaterialReceipt)
    private receiptRepo: Repository<RawMaterialReceipt>,

    private dataSource: DataSource,
  ) {}

  // ----------------------
  // CREATE INVENTORY
  // ----------------------
  async create(
    createDto: Partial<RawMaterialInventory>,
  ): Promise<RawMaterialInventory> {
    const inventory = this.inventoryRepo.create({
      ...createDto,
      quantity_on_hand: createDto.quantity_on_hand ?? 0,
      value: createDto.value ?? 0,
    });

    return this.inventoryRepo.save(inventory);
  }

  // ----------------------
  // UPDATE INVENTORY
  // ----------------------
  async update(
    id: string,
    updateDto: Partial<RawMaterialInventory>,
  ): Promise<RawMaterialInventory> {
    const inventory = await this.inventoryRepo.findOne({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with id ${id} not found`);
    }

    Object.assign(inventory, updateDto);

    return this.inventoryRepo.save(inventory);
  }

  // ----------------------
  // DELETE INVENTORY
  // ----------------------
  async remove(id: string): Promise<void> {
    const inventory = await this.inventoryRepo.findOne({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with id ${id} not found`);
    }

    await this.inventoryRepo.remove(inventory);
  }

  // ----------------------
  // ADD RECEIPT + UPDATE INVENTORY
  // (WAC / FIFO – simplified)
  // ----------------------
  async addReceipt(
    inventoryId: string,
    quantityReceived: number,
    unitCost: number,
  ): Promise<RawMaterialReceipt> {
    return this.dataSource.transaction(async (manager) => {
      const inventory = await manager.findOne(RawMaterialInventory, {
        where: { id: inventoryId },
      });

      if (!inventory) {
        throw new NotFoundException('Inventory not found');
      }

      // =======================
      // VALUATION LOGIC
      // =======================

      if (inventory.valuation_method === ValuationMethod.WAC) {
        const totalValue =
          Number(inventory.value) * Number(inventory.quantity_on_hand);

        const newTotalValue =
          totalValue + Number(quantityReceived) * Number(unitCost);

        const newQuantity =
          Number(inventory.quantity_on_hand) + Number(quantityReceived);

        inventory.quantity_on_hand = newQuantity;
        inventory.value = newTotalValue / newQuantity;
      }

      if (inventory.valuation_method === ValuationMethod.FIFO) {
        inventory.quantity_on_hand =
          Number(inventory.quantity_on_hand) + Number(quantityReceived);

        // simplified FIFO – keep last cost
        inventory.value = Number(unitCost);
      }

      await manager.save(inventory);

      // =======================
      // CREATE RECEIPT
      // =======================
      const receipt = manager.create(RawMaterialReceipt, {
        inventory,
        quantityReceived,
        total_unit_cost: unitCost,
        totalCost: Number(unitCost) * Number(quantityReceived),
      });

      return manager.save(receipt);
    });
  }

  // ----------------------
  // FIND ALL
  // ----------------------
  async findAll(): Promise<RawMaterialInventory[]> {
    return this.inventoryRepo.find({
      relations: ['rawMaterial', 'receipts'],
    });
  }

  // ----------------------
  // FIND ONE
  // ----------------------
  async findOne(id: string): Promise<RawMaterialInventory> {
    const inventory = await this.inventoryRepo.findOne({
      where: { id },
      relations: ['rawMaterial', 'receipts'],
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with id ${id} not found`);
    }

    return inventory;
  }
}
