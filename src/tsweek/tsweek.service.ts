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
import { TsWeekRepository } from './tsweek.repository';
import { TsWeek } from './tsweek.entity';
import { FilterTsweekDto } from './dto/filter-tsweek.dto';

@Injectable()
export class TsWeekService {

  constructor(
    @InjectRepository(TsWeekRepository)
    private tsweekRepository: TsWeekRepository) {}

    /**
    * Returns a Promise of an array of Tsweek based on filter. One to many Tsweek can be returned.
    * @param filterTsweekDto
    */
    async getTsweek(filterTsweekDto: FilterTsweekDto): Promise<TsWeek[]> {
      return this.tsweekRepository.getTsweeks(filterTsweekDto);
    }

    async getTsweekById(id: number):Promise<TsWeek> {
      return this.tsweekRepository.getTsweekById(id);
    }

    async createTsWeek(): Promise<void> {
      await this.tsweekRepository.createTsWeek();
    }

    async
}


