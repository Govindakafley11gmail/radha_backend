import { Test, TestingModule } from '@nestjs/testing';
import { TaxmasterController } from './taxmaster.controller';
import { TaxmasterService } from './taxmaster.service';

describe('TaxmasterController', () => {
  let controller: TaxmasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxmasterController],
      providers: [TaxmasterService],
    }).compile();

    controller = module.get<TaxmasterController>(TaxmasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
