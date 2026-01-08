import { Test, TestingModule } from '@nestjs/testing';
import { SalarypaymentService } from './salarypayment.service';

describe('SalarypaymentService', () => {
  let service: SalarypaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalarypaymentService],
    }).compile();

    service = module.get<SalarypaymentService>(SalarypaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
