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
