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

  async getUser(filterTsuserDto: FilterTsuserDto): Promise<Tsuser[]> {

    return this.tsuserRepository.getUser(filterTsuserDto);
  }

  async createUser(createTsuserDto: CreateTsuserDto): Promise<Tsuser> {
    return this.tsuserRepository.createUser(createTsuserDto);
  }
}
