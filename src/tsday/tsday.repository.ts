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

import { EntityRepository, getConnection, Repository, UpdateResult } from 'typeorm';
import { TsDay } from './tsday.entity';
import { CreateTsDayDto } from './dto/create-tsday.dto';
import { TsUser } from '../auth/tsuser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TsWeekRepository } from '../tsweek/tsweek.repository';
import { TsWeek } from '../tsweek/tsweek.entity';
import { UpdateTsDayDto } from './dto/update-tsday.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(TsDay)
export class TsDayRepository extends Repository<TsDay> {

  constructor(@InjectRepository(TsWeekRepository) private tsWeekRepository: TsWeekRepository) {
    super();
  }

  async createTsDay(tsUser: TsUser, createTsDayDto: CreateTsDayDto): Promise<void> {

    const { day, weekId, darpaMins, nonDarpaMins, sickMins, ptoMins, holidayMins } = createTsDayDto;

    const startDate = await getConnection().getRepository(TsWeek)
      .createQueryBuilder("tsWeek")
      .where("tsWeek.id = :id", { id: weekId })
      .getOne();

    /*
    Day is calculated by getting the start date from tsWeek.
     */
    const updatedDay = startDate.begin.getDate() + Number(day);
    const month = startDate.begin.getMonth();
    const year = startDate.begin.getFullYear();

    const tsDay = new TsDay();
    tsDay.tsUser = tsUser
    tsDay.day = new Date(year, month, updatedDay);
    tsDay.weekId = weekId;
    tsDay.darpaMins = darpaMins;
    tsDay.nonDarpaMins = nonDarpaMins;
    tsDay.sickMins = sickMins;
    tsDay.ptoMins = ptoMins;
    tsDay.holidayMins = holidayMins;

    await tsDay.save();
  }

  /**
   * Get days in blocks of 7 based of of weekId
   * @param tsUser
   * @param weekId
   */
  async getTsDays(tsUser: TsUser, weekId: number): Promise<TsDay[]> {

    return this.find({
      where: { weekId: weekId,
      tsUser: tsUser
      }});

  }

  async updateTsDay(tsUser: TsUser, dayId: Date, updateTsDayDto: UpdateTsDayDto ): Promise<UpdateResult> {


    const { darpaMins, nonDarpaMins, sickMins, ptoMins, holidayMins } = updateTsDayDto;

    try {
      return await this.update({ tsUser: tsUser, day: dayId }, {
        darpaMins: darpaMins,
        nonDarpaMins: nonDarpaMins,
        sickMins: sickMins,
        ptoMins: ptoMins,
        holidayMins: holidayMins
      });
    }
    catch (err){
      new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}