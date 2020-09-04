/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TsuserRepository } from './tsuser.repository';
import { FilterTsuserDto } from './dto/filter-user.dto';
import { Tsuser } from './tsuser.entity';
import { CreateTsuserDto } from './dto/create-user.dto';

@Injectable()
export class TsuserService {

  constructor(
    @InjectRepository(TsuserRepository)
    private tsuserRepository: TsuserRepository) {}

  /**
   * Returns a Promise of an array of Tsuser based on filter. One to many Tsuser can be returned.
   * @param filterTsweekDto
   */
  async getTsusers(filterTsuserDto: FilterTsuserDto): Promise<Tsuser[]> {

    return this.tsuserRepository.getTsusers(filterTsuserDto);
  }

  async createTsuser(createTsuserDto: CreateTsuserDto): Promise<void> {
    return this.tsuserRepository.createTsuser(createTsuserDto);
  }
}
