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


import { EntityRepository, getConnection, MoreThanOrEqual, Repository } from 'typeorm';
import { OnfDay } from './onf-day.entity';
import { Week } from '../week/week.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(OnfDay)
export class OnfDayRepository extends Repository<OnfDay> {

  async createOnfDays(days: string[]): Promise<void> {

    for (let i = 0; i < days.length; i++) {

      try {

        const date = new Date(days[i]);
        const week = await getConnection().getRepository(Week).findOne({
          where: [
            { end: MoreThanOrEqual(date) },
          ],
        });

        const onfDay = new OnfDay();
        onfDay.date = date;
        await onfDay.save();

        week.onfDays.push(onfDay);
        await week.save();

      } catch (e) {
        throw new HttpException('ONF day ' + days[i] + ' already created', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
