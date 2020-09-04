/*
 * Copyright 2020-present Open Networking Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
