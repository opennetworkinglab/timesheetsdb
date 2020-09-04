/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TsweeklyRepository } from './tsweekly.repository';
import { FilterTsweeklyDto } from './dto/filter-tsweekly.dto';
import { Tsweekly } from './tsweekly.entity';
import { CreateTsweeklyDto } from './dto/create-tsweekly.dto';

@Injectable()
export class TsweeklyService {

  constructor(
    @InjectRepository(TsweeklyRepository)
    private tsweeklyRepository: TsweeklyRepository) {}

  /**
   * Returns a Promise of an array of Tsweekly based on filter. One to many Tsweekly can be returned.
   * @param filterTsweeklyDto
   */
  async getTsweekly(filterTsweeklyDto: FilterTsweeklyDto): Promise<Tsweekly[]> {
    return this.tsweeklyRepository.getTsweekly(filterTsweeklyDto);
  }

  async createTsweekly(createTsweeklyDto: CreateTsweeklyDto): Promise<void> {
    return this.tsweeklyRepository.createTsweekly(createTsweeklyDto);
  }
}
