import { Test, TestingModule } from '@nestjs/testing';
import { OnfDayController } from './onf-day.controller';

describe('OnfDayController', () => {
  let controller: OnfDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnfDayController],
    }).compile();

    controller = module.get<OnfDayController>(OnfDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
