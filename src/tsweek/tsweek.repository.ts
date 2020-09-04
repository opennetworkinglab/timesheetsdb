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
import { Tsweek } from './tsweek.entity';
import { FilterTsweekDto } from './dto/filter-tsweek.dto';

@EntityRepository(Tsweek)
export class TsweekRepository extends Repository<Tsweek> {

  /**
   * Returns a Promise of an array of Tsweek based on filter. One to many Tsweek can be returned.
   * @param filterTsweekDto
   */
  async getTsweeks(filterTsweekDto: FilterTsweekDto): Promise<Tsweek[]> {

    const { year, weekno } = filterTsweekDto;

    const query = this.createQueryBuilder('tsweek');

    if (year) {
      query.andWhere('tsweek.year = :year', { year });
    }

    if (weekno) {
      query.andWhere('tsweek.weekno = :weekno', { weekno });
    }

    // Gets all the weeks or weeks based on filters
    return await query.getMany();
  }

  async createTsweek(): Promise<void> {

    const weekms = 168 * 60 * 60 * 1000;
    const startdate = 1588550400000; // Mon 4th may 2020
    const initweek = 18;

    // Populating tsweeks table
    for (let w = 1; w <= 34; w++) {
      const d = new Date(startdate + w * weekms);
      const tsweek = new Tsweek();
      tsweek.year = d.getFullYear();
      tsweek.weekno = initweek + w;
      tsweek.monthno = d.getMonth();
      tsweek.begin = new Date(d.getTime());
      tsweek.end = new Date(d.getTime() + weekms - 1000);
      await tsweek.save();
    }
  }
}