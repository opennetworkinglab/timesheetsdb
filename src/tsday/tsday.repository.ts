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

import { EntityRepository, Repository } from 'typeorm';
import { Tsday } from './tsday.entity';
import { CreateTsdayDto } from './dto/create-tsday.dto';
import { FilterTsdayDto } from './dto/filter-tsday.dto';

@EntityRepository(Tsday)
export class TsdayRepository extends Repository<Tsday> {

  /**
   * Returns a Promise of an array of Tsday based on filter. One to many Tsday can be returned.
   * @param filterTsdayDto
   */
  async getTsdays(filterTsdayDto: FilterTsdayDto): Promise<Tsday[]> {

    const { email, weekid, } = filterTsdayDto;

    const query = this.createQueryBuilder('tsday');

    if (email) {
      query.andWhere('tsday.email = :email', { email });
    }

    if (weekid) {
      query.andWhere('tsday.weekid = :weekid', { weekid });
    }

    return await query.getMany();
  }

  async createTsday(createTsdayDto: CreateTsdayDto): Promise<void> {

    const { email, day, weekid, darpamins, nondarpamins, sickmins, ptomins, holidaymins } = createTsdayDto;

    const tsday = new Tsday();
    tsday.email = email
    tsday.day = new Date(); // will be day
    tsday.weekid = weekid;
    tsday.darpamins = darpamins;
    tsday.nondarpamins = nondarpamins;
    tsday.sickmins = sickmins;
    tsday.ptomins = ptomins;
    tsday.holidaymins = holidaymins;

    await tsday.save();
  }
}