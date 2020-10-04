import { Test, TestingModule } from '@nestjs/testing';
import { TimeController } from './time.controller';

describe('TimeController', () => {
  let controller: TimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeController],
    }).compile();

    controller = module.get<TimeController>(TimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
