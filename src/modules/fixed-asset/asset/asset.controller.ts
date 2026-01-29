import { 
  Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus 
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ResponseService } from 'src/common/response/response';

@Controller('asset')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly responseService: ResponseService, // inject it
  ) {}

  @Post()
  async create(@Body() createAssetDto: CreateAssetDto) {
    try {
      const asset = await this.assetService.create(createAssetDto);
      return this.responseService.success(
        asset,
        'Asset created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create asset',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const assets = await this.assetService.findAll();
      return this.responseService.success(
        assets,
        'Assets retrieved successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to retrieve assets',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const asset = await this.assetService.findOne(id);
      return this.responseService.success(
        asset,
        'Asset retrieved successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to retrieve asset',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    try {
      const asset = await this.assetService.update(id, updateAssetDto);
      return this.responseService.success(
        asset,
        'Asset updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update asset',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Patch('approve/:id')
  async approveAsset(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    try {
      const asset = await this.assetService.approveAsset(id, updateAssetDto);
      return this.responseService.success(
        asset,
        'Asset approved successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to approve asset',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.assetService.remove(id);
      return this.responseService.success(
        null,
        'Asset deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete asset',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
