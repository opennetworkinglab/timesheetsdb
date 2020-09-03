import { Test, TestingModule } from '@nestjs/testing';
import { TsdayService } from './tsday.service';

describe('TsdayService', () => {
  let service: TsdayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TsdayService],
    }).compile();

    service = module.get<TsdayService>(TsdayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
