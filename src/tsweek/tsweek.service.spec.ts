/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TsweekService } from './tsweek.service';

describe('TsweekService', () => {
  let service: TsweekService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TsweekService],
    }).compile();

    service = module.get<TsweekService>(TsweekService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
