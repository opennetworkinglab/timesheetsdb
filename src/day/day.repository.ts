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

import { EntityRepository, getConnection, MoreThan, Repository, UpdateResult } from 'typeorm';
import { Day } from './day.entity';
import { UpdateDayDto } from './dto/update-day.dto';
import { User } from '../auth/user.entity';
import { Time } from '../time/time.entity';
import { Week } from '../week/week.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(Day)
export class DayRepository extends Repository<Day> {

  async createDay(user: User, day: Date, updateDayDto: UpdateDayDto): Promise<void>{

    const { project, minutes } = updateDayDto;

    // Check project user is part of project
    if (!DayRepository.userHasProject(user.projects, project)){
      throw new HttpException("User is not part of project: " + project, HttpStatus.BAD_REQUEST);
    }

    const week = await getConnection().getRepository(Week).findOne({
      where: [
        { end: MoreThan(day)},
        { end: day }
      ]});

    const newDay = new Day();
    newDay.user = user;
    newDay.day = day;
    newDay.weekId = week.id;
    newDay.times = [];

    for(let i = 0; i < user.projects.length; i++){

      const newTime = new Time();
      newTime.name = user.projects[i].name;

      if(newTime.name === project){
        newTime.minutes = minutes;
      }
      else{
        newTime.minutes = 0;
      }

      await newTime.save();
      newDay.times.push(newTime);

    }

    await newDay.save();
  }

  async updateDay(user: User, day: Date, updateDayDto: UpdateDayDto): Promise<UpdateResult> {

    const updateDay = await this.findOne({ where: { user: user, day: day }})

    if(!updateDay){

      await this.createDay(user, day, updateDayDto);
      throw new HttpException("Created Day:" + day, HttpStatus.CREATED);
    }

    const { project, minutes } = updateDayDto;

    // update for existing times
    for(let i = 0; i < updateDay.times.length; i++){

      if(updateDay.times[i].name === project){

        return await getConnection().getRepository(Time).update({
          id: updateDay.times[i].id
        }, {
          minutes: minutes
        })
      }
    }

    // Check project user is part of project
    if (!DayRepository.userHasProject(user.projects, project)){
      throw new HttpException("User is not part of project: " + project, HttpStatus.BAD_REQUEST);
    }

    throw new HttpException("Updated day with " + project, HttpStatus.ACCEPTED);
  }

  async getDays(user: User, weekId: number): Promise<Day[]> {

    return this.find({
      where: { weekId: weekId,
        user: user
      }});
  }

  private static userHasProject(times: any, project: string){

    for (let i = 0; i < times.length; i++){
      if(times[i].name === project){
        return true;
      }
    }
    return false;
  }
}