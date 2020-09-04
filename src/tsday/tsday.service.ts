/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TsdayRepository } from './tsday.repository';
import { FilterTsdayDto } from './dto/filter-tsday.dto';
import { Tsday } from './tsday.entity';
import { CreateTsdayDto } from './dto/create-tsday.dto';

@Injectable()
export class TsdayService {

  constructor(
    @InjectRepository(TsdayRepository)
    private tsdayRepository: TsdayRepository) {}

  /**
   * Returns a Promise of an array of Tsday based on filter. One to many Tsday can be returned.
   * @param filterTsdayDto
   */
  async getTsdays(filterTsdayDto: FilterTsdayDto): Promise<Tsday[]> {

    return this.tsdayRepository.getTsdays(filterTsdayDto);
  }

  async createTsday(createTsdayDto: CreateTsdayDto): Promise<void> {
    return this.tsdayRepository.createTsday(createTsdayDto);
  }
}
