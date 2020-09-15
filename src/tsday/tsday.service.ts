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

import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TsDayRepository } from './tsday.repository';
import { TsDay } from './tsday.entity';
import { CreateTsDayDto } from './dto/create-tsday.dto';
import { UpdateTsDayDto } from './dto/update-tsday.dto';
import { UpdateResult } from 'typeorm';
import { TsUser } from '../auth/tsuser.entity';

@Injectable()
export class TsDayService {

  constructor(
    @InjectRepository(TsDayRepository)
    private tsDayRepository: TsDayRepository) {}

  async getTsDays(tsUser: TsUser, weekId: number): Promise<TsDay[]> {
    return this.tsDayRepository.getTsDays(tsUser, weekId);
  }

  // async getTsdayById(emailId: string): Promise<TsDay[]> {
  //   return this.tsDayRepository.getTsdayById(emailId);
  // }

  async createTsDay(tsUser: TsUser, createTsDayDto: CreateTsDayDto): Promise<void> {
    return this.tsDayRepository.createTsDay(tsUser, createTsDayDto);
  }

  async updateTsDay(tsUser: TsUser, dayId: Date, updateTsDayDto: UpdateTsDayDto ): Promise<UpdateResult> {
    return await this.tsDayRepository.updateTsDay(tsUser, dayId, updateTsDayDto)
  }
}
