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
import { Week } from './week.entity';
import { FilterWeekDto } from './dto/filter-week.dto';

@EntityRepository(Week)
export class WeekRepository extends Repository<Week> {

  constructor() {
    super();

    // Create week on first start of application
    this.createWeek().then(() => {
      console.log("Weeks created");
    }).catch(()=> {
      console.log("Weeks already created");
    });
  }

  async getWeeks(filterWeekDto: FilterWeekDto): Promise<Week[]> {

    const { year, weekNo } = filterWeekDto;

    const query = this.createQueryBuilder('week');

    if (year) {
      query.andWhere('week.year = :year', { year });
    }

    if (weekNo) {
      query.andWhere('week.weekNo = :weekNo', { weekNo: weekNo });
    }

    // Gets all the weeks or weeks based on filters
    return await query.getMany();
  }

  async getWeekById(id: number):Promise<Week> {

    return await this.findOne({ id: id });
  }

  async createWeek(): Promise<void> {

    const weekMs = 168 * 60 * 60 * 1000;
    const startDate = 1588550400000; // Mon 4th may 2020
    const initWeek = 18;

    // Populating weeks table 34
    for (let w = 1; w <= 34; w++) {

      const d = new Date(startDate + w * weekMs);

      const week = new Week();
      week.year = d.getFullYear();
      week.weekNo = initWeek + w;
      week.monthNo = d.getMonth();
      week.begin = new Date(d.getTime());
      week.end = new Date(d.getTime() + weekMs - 1000);
      await week.save();
    }
  }
}