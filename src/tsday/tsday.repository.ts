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

import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { TsDay } from './tsday.entity';
import { CreateTsDayDto } from './dto/create-tsday.dto';
import { FilterTsDayDto } from './dto/filter-tsday.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateTsdayDto } from './dto/update-tsday.dto';


@EntityRepository(TsDay)
export class TsDayRepository extends Repository<TsDay> {

  async getTsDays(): Promise<TsDay[]> {

    return await this.find();
  }

  async getTsdayById(emailId: string): Promise<TsDay[]> {

    const found = await this.find({ email: emailId });

    if (!found) {
      throw new HttpException('Not in table', HttpStatus.BAD_REQUEST);
    }

    return found;
  }

  async createTsDay(createTsDayDto: CreateTsDayDto): Promise<void> {

    const { email, day, weekId, darpaMins, nonDarpaMins, sickMins, ptoMins, holidayMins } = createTsDayDto;

    const tsDay = new TsDay();
    tsDay.email = email
    tsDay.day = new Date('2020-9-8'); // will be day
    tsDay.weekId = weekId;
    tsDay.darpaMins = darpaMins;
    tsDay.nonDarpaMins = nonDarpaMins;
    tsDay.sickMins = sickMins;
    tsDay.ptoMins = ptoMins;
    tsDay.holidayMins = holidayMins;

    await tsDay.save();
  }

  // async updateTsdayMins(emailId: string, dayId: Date, updateTsdayDto: UpdateTsdayDto): Promise<UpdateResult> {
  //
  //   const { darpamins, nondarpamins, sickmins, ptomins, holidaymins } = updateTsdayDto;
  //
  //   return await this.update({ email: emailId, day: dayId }, { darpaMins: darpamins,
  //                                                                                nonDarpaMins: nondarpamins,
  //                                                                                sickMins: sickmins,
  //                                                                                ptoMins: ptomins,
  //                                                                                holidayMins: holidaymins });
  // }
}