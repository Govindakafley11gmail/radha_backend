import { Test, TestingModule } from '@nestjs/testing';
import { SalarypaymentController } from './salarypayment.controller';
import { SalarypaymentService } from './salarypayment.service';

describe('SalarypaymentController', () => {
  let controller: SalarypaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalarypaymentController],
      providers: [SalarypaymentService],
    }).compile();

    controller = module.get<SalarypaymentController>(SalarypaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
