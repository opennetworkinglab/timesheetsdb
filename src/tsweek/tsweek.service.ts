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

    /**
    * Returns a Promise of an array of Tsweek based on filter. One to many Tsweek can be returned.
    * @param filterTsweekDto
    */
    async getTsweek(filterTsweekDto: FilterTsweekDto): Promise<Tsweek[]> {

      return this.tsweekRepository.getTsweeks(filterTsweekDto);
    }

    async createTsweek(): Promise<void> {
      await this.tsweekRepository.createTsweek();
    }
}


