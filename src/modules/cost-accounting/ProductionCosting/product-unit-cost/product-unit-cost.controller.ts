import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ProductUnitCostService } from './product-unit-cost.service';
import { CreateProductUnitCostDto } from './dto/create-product-unit-cost.dto';
import { UpdateProductUnitCostDto } from './dto/update-product-unit-cost.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('product-unit-cost')
export class ProductUnitCostController {
  constructor(private readonly productUnitCostService: ProductUnitCostService) {}

  // ----------------------
  // CREATE Product Unit Cost
  // ----------------------
  @Post()
  async create(@Body() createProductUnitCostDto: CreateProductUnitCostDto) {
    try {
      const productUnitCost = await this.productUnitCostService.create(createProductUnitCostDto);
      return responseService.success(
        productUnitCost,
        'Product unit cost created successfully',
        HttpStatus.CREATED
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create product unit cost',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ----------------------
  // GET ALL Product Unit Costs
  // ----------------------
  @Get()
  async findAll() {
    try {
      const costs = await this.productUnitCostService.findAll();
      return responseService.success(
        costs,
        'All product unit costs fetched successfully',
        HttpStatus.OK
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch product unit costs',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ----------------------
  // GET SINGLE Product Unit Cost
  // ----------------------
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const cost = await this.productUnitCostService.findOne(id);
      return responseService.success(cost, 'Product unit cost fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to fetch product unit cost with ID ${id}`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  // ----------------------
  // UPDATE Product Unit Cost
  // ----------------------
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductUnitCostDto: UpdateProductUnitCostDto) {
    try {
      const updated = await this.productUnitCostService.update(id, updateProductUnitCostDto);
      return responseService.success(updated, 'Product unit cost updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to update product unit cost with ID ${id}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ----------------------
  // DELETE Product Unit Cost
  // ----------------------
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.productUnitCostService.remove(id);
      return responseService.success(null, 'Product unit cost removed successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to remove product unit cost with ID ${id}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  @Get('post-batch-cost/:batchId')
  async postBatchCostToAccounting(@Param('batchId') batchId: string) {
    try {
      await this.productUnitCostService.postBatchCostToAccounting(batchId);
      return responseService.success(null, 'Batch cost posted to accounting successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to post batch cost to accounting for Batch ID ${batchId}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
