/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TsweeklyService } from './tsweekly.service';

describe('TsweeklyService', () => {
  let service: TsweeklyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TsweeklyService],
    }).compile();

    service = module.get<TsweeklyService>(TsweeklyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
