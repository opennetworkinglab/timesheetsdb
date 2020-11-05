import { Test, TestingModule } from '@nestjs/testing';
import { OnfDayService } from './onf-day.service';

describe('OnfDayService', () => {
  let service: OnfDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnfDayService],
    }).compile();

    service = module.get<OnfDayService>(OnfDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
