import { Test, TestingModule } from '@nestjs/testing';
import { TimeService } from './time.service';

describe('TimeService', () => {
  let service: TimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeService],
    }).compile();

    service = module.get<TimeService>(TimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
