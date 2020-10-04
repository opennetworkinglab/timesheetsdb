import { Test, TestingModule } from '@nestjs/testing';
import { WeekController } from './week.controller';

describe('WeekController', () => {
  let controller: WeekController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeekController],
    }).compile();

    controller = module.get<WeekController>(WeekController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
