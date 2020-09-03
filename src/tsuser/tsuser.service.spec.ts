import { Test, TestingModule } from '@nestjs/testing';
import { TsuserService } from './tsuser.service';

describe('TsuserService', () => {
  let service: TsuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TsuserService],
    }).compile();

    service = module.get<TsuserService>(TsuserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
