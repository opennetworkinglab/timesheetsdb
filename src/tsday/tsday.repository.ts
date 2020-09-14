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
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateTsdayDto } from './dto/update-tsday.dto';
import { TsUser } from '../auth/tsuser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TsWeekRepository } from '../tsweek/tsweek.repository';
import { TsWeek } from '../tsweek/tsweek.entity';

@EntityRepository(TsDay)
export class TsDayRepository extends Repository<TsDay> {

  constructor(@InjectRepository(TsWeekRepository) private tsWeekRepository: TsWeekRepository) {
    super();
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

    return await this.find();
  }

  /**
   * Creates days in blocks of 7 based on weekId
   * @param tsUser
   * @param createTsDayDto
   */
  async createTsDays(tsUser: TsUser, createTsDayDto: CreateTsDayDto): Promise<void> {

    const { weekId } = createTsDayDto;

    const startDate = await getConnection().getRepository(TsWeek)
      .createQueryBuilder("tsWeek")
      .where("tsWeek.id = :id", { id: weekId })
      .getOne();

    /*
    Day is calculated by getting the start date from tsWeek. Creates the next 7 days. This will be one tsWeekly
     */
    const day = startDate.begin.getDate();
    const month = startDate.begin.getMonth();
    const year = startDate.begin.getFullYear();

    for (let i = 0; i < 7; i++){

      const tsDay = new TsDay();
      tsDay.tsUser = tsUser
      tsDay.day = new Date(year, month, (day + i));
      tsDay.weekId = weekId;
      tsDay.darpaMins = 0;
      tsDay.nonDarpaMins = 0;
      tsDay.sickMins = 0;
      tsDay.ptoMins = 0;
      tsDay.holidayMins = 0;

      await tsDay.save();
    }
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