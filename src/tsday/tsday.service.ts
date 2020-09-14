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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TsDayRepository } from './tsday.repository';
import { TsDay } from './tsday.entity';
import { CreateTsDayDto } from './dto/create-tsday.dto';
import { UpdateTsdayDto } from './dto/update-tsday.dto';
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
    return this.tsDayRepository.createTsDays(tsUser, createTsDayDto);
  }

  // async updateTsdayMins(username: string, emailId: string, dayId: Date, updateTsdayDto: UpdateTsdayDto): Promise<UpdateResult> {
  //
  //
  //   const authorised = await this.tsDayRepository.findOne({
  //     select: ['email', 'darpaMins', 'nonDarpaMins', 'sickMins', 'ptoMins', 'holidayMins'],
  //     where: {email: emailId }
  //   })
  //
  //   if(authorised.email !== username){
  //     throw new HttpException("Not authorised to make changes", HttpStatus.UNAUTHORIZED);
  //   }
  //
  //   const { darpamins, nondarpamins, sickmins, ptomins, holidaymins } = updateTsdayDto;
  //
  //   if(!darpamins){
  //     updateTsdayDto.darpamins = authorised.darpaMins;
  //   }
  //
  //   if(!nondarpamins) {
  //     updateTsdayDto.nondarpamins = authorised.nonDarpaMins;
  //   }
  //
  //   if(!sickmins) {
  //     updateTsdayDto.sickmins = authorised.sickMins
  //   }
  //
  //   if(!ptomins) {
  //     updateTsdayDto.ptomins = authorised.ptoMins;
  //   }
  //
  //   if(!holidaymins) {
  //     updateTsdayDto.holidaymins = authorised.holidayMins;
  //   }
  //
  //   return this.tsDayRepository.updateTsdayMins(emailId, dayId, updateTsdayDto);
  // }
}
