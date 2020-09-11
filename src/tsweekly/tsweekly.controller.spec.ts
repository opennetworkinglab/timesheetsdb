import { Test, TestingModule } from '@nestjs/testing';
import { TsWeeklyController } from './tsweekly.controller';

describe('TsweeklyController', () => {
  let controller: TsWeeklyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TsWeeklyController],
    }).compile();

    controller = module.get<TsWeeklyController>(TsWeeklyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
