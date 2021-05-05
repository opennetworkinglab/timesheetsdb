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
import { OnfDay } from '../onf-day/onf-day.entity';

const onfDays = [ [26, 10, 2020], [27, 10, 2020] ];

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

  async getWeeks(): Promise<Week[]> {

    return await this.find();
  }

  async getWeekById(id: number):Promise<Week> {

    return await this.findOne({ id: id });
  }

  async createWeeks(): Promise<void> {

    const lastWeek = await this.findOne({
      order: { id: 'DESC' }
    });

    const currentDate = new Date(lastWeek.begin);

    let currentYear = currentDate.getFullYear();

    const weekS = 168 * 60 * 60 * 1000;
    const startDate = Math.round(+currentDate);
    let initWeek = lastWeek.weekNo + 1;

    //TODO: change to 1 week
    for (let w = 1; w <= 52; w++) {

      const d = new Date(startDate + w * weekS);

      if(d.getFullYear() !== currentYear){
        initWeek = 1;
        currentYear = d.getFullYear();
      }

      const week = new Week();
      week.year = d.getFullYear();
      week.weekNo = initWeek;
      week.monthNo = d.getMonth() + 1;
      week.begin = new Date(d.getTime());
      week.end = new Date(d.getTime() + (weekS) - 1000);
      week.onfDays = [];
      await week.save();
      initWeek++;
    }
  }

  async createWeek(): Promise<void> {

    const weekMs = 168 * 60 * 60 * 1000;
    const startDate = 1588550400000; // Mon 4th may 2020
    let initWeek = 19;

    let currentYear = new Date(startDate + 1 * weekMs).getFullYear();

    // Populating weeks table 34
    for (let w = 1; w <= 1; w++) {

      const d = new Date(startDate + w * weekMs);

      if(d.getFullYear() !== currentYear){
        initWeek = 1;
        currentYear = d.getFullYear();
      }

      const week = new Week();
      week.year = d.getFullYear();
      week.weekNo = initWeek;
      week.monthNo = d.getMonth() + 1; // Its from 0 - 11
      week.begin = new Date(d.getTime());
      week.end = new Date(d.getTime() + weekMs - 1000);
      week.onfDays = [];

      for(let i = 0; i < onfDays.length; i++){
        // console.log("Week: \n\t",d.getDate(), onfDays[i][0], "\n\t", d.getMonth(), onfDays[i][1], "\n\t", d.getFullYear(), onfDays[i][2]);
        if(d.getDate() <= onfDays[i][0] && onfDays[i][0] <= d.getDate() + 6 && d.getMonth() === onfDays[i][1] && d.getFullYear() === onfDays[i][2]){

          const onfDay = new OnfDay();
          onfDay.date = new Date(onfDays[i][2], onfDays[i][1], onfDays[i][0]);
          await onfDay.save();

          week.onfDays.push(onfDay);
        }
      }

      await week.save();
      initWeek++;
    }
  }
}
