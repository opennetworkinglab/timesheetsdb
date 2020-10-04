import { Test, TestingModule } from '@nestjs/testing';
import { WeekService } from './week.service';

describe('WeekService', () => {
  let service: WeekService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeekService],
    }).compile();

    service = module.get<WeekService>(WeekService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
