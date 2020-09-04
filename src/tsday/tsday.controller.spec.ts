/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TsdayController } from './tsday.controller';

describe('TsdayController', () => {
  let controller: TsdayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TsdayController],
    }).compile();

    controller = module.get<TsdayController>(TsdayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
