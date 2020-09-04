import { Test, TestingModule } from '@nestjs/testing';
import { TsweeklyController } from './tsweekly.controller';

describe('TsweeklyController', () => {
  let controller: TsweeklyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TsweeklyController],
    }).compile();

    controller = module.get<TsweeklyController>(TsweeklyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
