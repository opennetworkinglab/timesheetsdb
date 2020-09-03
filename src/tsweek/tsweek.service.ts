/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TsweekRepository } from './tsweek.repository';
import { Tsweek } from './tsweek.entity';
import { FilterTsweekDto } from './dto/filter-tsweek.dto';

@Injectable()
export class TsweekService {

  constructor(
    @InjectRepository(TsweekRepository)
    private tsweekRepository: TsweekRepository) {}

    async getTsweek(filterTsweekDto: FilterTsweekDto): Promise<Tsweek[]> {

      return this.tsweekRepository.getWeeks(filterTsweekDto);
    }

    async createTsweek(): Promise<void> {
      this.tsweekRepository.createWeek();
    }
}


