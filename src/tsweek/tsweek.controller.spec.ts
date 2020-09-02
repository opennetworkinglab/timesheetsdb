/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TsweekController } from './tsweek.controller';

describe('TsweekController', () => {
  let controller: TsweekController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TsweekController],
    }).compile();

    controller = module.get<TsweekController>(TsweekController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
