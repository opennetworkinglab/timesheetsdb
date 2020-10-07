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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DayRepository } from './day.repository';
import { User } from '../auth/user.entity';
import { Day } from './day.entity';
import { UpdateDayDto } from './dto/update-day.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class DayService {

  constructor(
    @InjectRepository(DayRepository)
    private tsDayRepository: DayRepository) {}

  async getDays(user: User, weekId: number): Promise<Day[]> {
    return this.tsDayRepository.getDays(user, weekId);
  }

  async updateDay(user: User, dayId: Date, updateDayDto: UpdateDayDto): Promise<UpdateResult> {
    return await this.tsDayRepository.updateDay(user, dayId, updateDayDto)
  }
}
