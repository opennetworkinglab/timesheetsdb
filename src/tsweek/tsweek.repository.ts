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
import { TsWeek } from './tsweek.entity';
import { FilterTsWeekDto } from './dto/filter-tsweek.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(TsWeek)
export class TsWeekRepository extends Repository<TsWeek> {

  async getTsWeeks(filterTsWeekDto: FilterTsWeekDto): Promise<TsWeek[]> {

    const { year, weekNo } = filterTsWeekDto;

    const query = this.createQueryBuilder('tsweek');

    if (year) {
      query.andWhere('tsweek.year = :year', { year });
    }

    if (weekNo) {
      query.andWhere('tsweek.weekno = :weekno', { weekNo: weekNo });
    }

    // Gets all the weeks or weeks based on filters
    return await query.getMany();
  }

  async getTsWeekById(id: number):Promise<TsWeek> {

    const found = await this.findOne({ id: id });

    if (!found) {
      throw new HttpException('Not in table', HttpStatus.BAD_REQUEST);
    }

    return found;
  }

  async createTsWeek(): Promise<void> {

    const weekms = 168 * 60 * 60 * 1000;
    const startdate = 1588550400000; // Mon 4th may 2020
    const initweek = 18;

    // Populating tsweeks table 34
    for (let w = 1; w <= 34; w++) {

      const d = new Date(startdate + w * weekms);

      const tsWeek = new TsWeek();
      tsWeek.year = d.getFullYear();
      tsWeek.weekNo = initweek + w;
      tsWeek.monthNo = d.getMonth();
      tsWeek.begin = new Date(d.getTime());
      console.log(new Date(d.getTime()));
      tsWeek.end = new Date(d.getTime() + weekms - 86400000);

      await tsWeek.save();
    }
  }
}