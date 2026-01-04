/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RawMaterialInventory, ValuationMethod } from './entities/raw-material-inventory.entity';
import { RawMaterialReceipt } from 'src/modules/cost-accounting/raw-meterials/raw-material-receipt/entities/raw-material-receipt.entity';

@Injectable()
export class RawMaterialInventoryService {
  constructor(
    @InjectRepository(RawMaterialInventory)
    private inventoryRepo: Repository<RawMaterialInventory>,

    @InjectRepository(RawMaterialReceipt)
    private receiptRepo: Repository<RawMaterialReceipt>,
  ) { }

  // ----------------------
  // CREATE INVENTORY
  // ----------------------
  async create(
    createDto: Partial<RawMaterialInventory>,
    userId?: number,
  ): Promise<RawMaterialInventory> {
    const inventory = this.inventoryRepo.create({
      ...createDto,
      createdBy: userId,
      updatedBy: userId,
    });
    return this.inventoryRepo.save(inventory);
  }

  // ----------------------
  // UPDATE INVENTORY
  // ----------------------
  async update(
    id: string,
    updateDto: Partial<RawMaterialInventory>,
    userId?: number,
  ): Promise<RawMaterialInventory> {
    const inventory = await this.inventoryRepo.findOne({
      where: { id },
      relations: ['rawMaterial', 'receipts'],
    });
    if (!inventory) {
      throw new NotFoundException(`Inventory with id ${id} not found`);
    }

    Object.assign(inventory, updateDto);
    if (userId) inventory.updatedBy = userId;

    return this.inventoryRepo.save(inventory);
  }

  // ----------------------
  // DELETE INVENTORY
  // ----------------------
  async remove(id: string): Promise<void> {
    const inventory = await this.inventoryRepo.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`Inventory with id ${id} not found`);
    }
    await this.inventoryRepo.remove(inventory);
  }

  // ----------------------
  // ADD RECEIPT + UPDATE INVENTORY (WAC)
  // ----------------------
  async addReceipt(
    inventoryId: string,
    quantityReceived: number,
    unitCost: number,
  ): Promise<RawMaterialReceipt> {
    const inventory = await this.inventoryRepo.findOne({
      where: { id: inventoryId },
      relations: ['receipts'],
    });
    if (!inventory) throw new NotFoundException('Inventory not found');

    // WAC Calculation
    if (inventory.valuation_method === ValuationMethod.WAC) {
      const totalValue = Number(inventory.value) * Number(inventory.quantity_on_hand);
      const newTotalValue = totalValue + quantityReceived * unitCost;
      const newQuantity = Number(inventory.quantity_on_hand) + quantityReceived;

      inventory.quantity_on_hand = newQuantity;
      inventory.value = newTotalValue / newQuantity;
    }

    // Save inventory first
    await this.inventoryRepo.save(inventory);

    // Create receipt
    const receipt = this.receiptRepo.create({
      inventory,                   // assign the inventory entity (relation)
      quantityReceived,            // number of units received
      total_unit_cost: unitCost,   // cost per unit
      totalCost: Number(unitCost) * Number(quantityReceived), // total cost
    });

    return this.receiptRepo.save(receipt);
  }

  // ----------------------
  // FIND ALL INVENTORIES
  // ----------------------
  async findAll(): Promise<RawMaterialInventory[]> {
    return this.inventoryRepo.find({ relations: ['rawMaterial', 'receipts'] });
  }

  // ----------------------
  // FIND ONE INVENTORY
  // ----------------------
  async findOne(id: string): Promise<RawMaterialInventory> {
    const inventory = await this.inventoryRepo.findOne({
      where: { id },
      relations: ['rawMaterial', 'receipts'],
    });
    if (!inventory) throw new NotFoundException(`Inventory with id ${id} not found`);
    return inventory;
  }
}
