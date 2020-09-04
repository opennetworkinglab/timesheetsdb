/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

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
