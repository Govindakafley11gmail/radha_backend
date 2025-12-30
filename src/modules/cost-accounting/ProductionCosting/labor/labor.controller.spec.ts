import { Test, TestingModule } from '@nestjs/testing';
import { LaborController } from './labor.controller';
import { LaborService } from './labor.service';

describe('LaborController', () => {
  let controller: LaborController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaborController],
      providers: [LaborService],
    }).compile();

    controller = module.get<LaborController>(LaborController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
