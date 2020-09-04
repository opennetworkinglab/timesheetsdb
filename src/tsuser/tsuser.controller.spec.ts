/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TsuserController } from './tsuser.controller';

describe('TsuserController', () => {
  let controller: TsuserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TsuserController],
    }).compile();

    controller = module.get<TsuserController>(TsuserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
