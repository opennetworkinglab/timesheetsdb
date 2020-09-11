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
import { TsWeeklyRepository } from './tsweekly.repository';
import { TsWeekly } from './tsweekly.entity';
import { CreateTsWeeklyDto } from './dto/create-tsweekly.dto';
import { UpdateTsWeeklyDto } from './dto/update-tsweekly.dto';
import { UpdateResult } from 'typeorm';
import { TsUserRepository } from '../auth/tsuser.repository';
import { TsUser } from '../auth/tsuser.entity';


@Injectable()
export class TsWeeklyService {

  constructor(
    @InjectRepository(TsWeeklyRepository)
    private tsWeeklyRepository: TsWeeklyRepository) {}

  async createTsWeekly(tsUser: TsUser, createTsweeklyDto: CreateTsWeeklyDto): Promise<void> {
      return this.tsWeeklyRepository.createTsWeekly(tsUser, createTsweeklyDto);
  }

  async getTsWeekly(tsUser: TsUser): Promise<TsWeekly[]> {
    return this.tsWeeklyRepository.getTsWeekly(tsUser);
  }

  // async getTsweeklyById(emailId: string): Promise<TsWeekly[]> {
  //   return this.tsWeeklyRepository.getTsweeklyById(emailId);
  // }
  //
  // async createTsweekly(createTsweeklyDto: CreateTsweeklyDto): Promise<void> {
  //   return this.tsWeeklyRepository.createTsWeekly(createTsweeklyDto);
  // }
  //
  // /**
  //  * Updates the tsweekly (document/ preview/ usersigned) based on the email and weekid. Checks that the caller has authorization to do so.
  //  * @param username
  //  * @param emailId
  //  * @param weekId
  //  * @param updateTsweeklyDto
  //  * @param userSigned1
  //  */

  async updateTsWeeklyUser(tsUser: TsUser, weekId: number, updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {
    return await this.tsWeeklyRepository.updateTsWeeklyUser(tsUser, weekId, updateTsWeeklyDto);
  }

  async updateTsWeeklyAdmin(tsUser: TsUser, emailId: string, weekId: number, updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {
    return this.tsWeeklyRepository.updateTsWeeklyAdmin(tsUser, emailId, weekId, updateTsWeeklyDto);
  }

  // /**
  //  * Updates the tsweekly (admin signed) based on the email and weekid. Checks that the caller has authorization to do so.
  //  * @param username
  //  * @param emailId
  //  * @param weekId
  //  * @param updateTsweeklyDto
  //  * @param userSigned1
  //  */
  // async updateTsweeklyAdmin(username: string, emailId: string, weekId: number, updateTsweeklyDto: UpdateTsweeklyDto, userSigned1: string): Promise<UpdateResult> {
  //
  //   // Check user active
  //   const active = await this.tsuserRepository.findOne({
  //   select: ['isActive'],
  //   where: { email: emailId }
  //   })
  //
  //   if (!active.isActive) {
  //     throw new HttpException("User not active", HttpStatus.BAD_REQUEST);
  //   }
  //
  //   // ============
  //   // Getting signed columns
  //   const signed = await this.tsWeeklyRepository.findOne({
  //     select: ['weekId', 'adminSigned'],
  //     where: { email: emailId, weekId: weekId }
  //   }); // Getting admin signed columns
  //
  //   const supervisor = await this.tsuserRepository.findOne({
  //     select: ['supervisorEmail'],
  //     where: { email: emailId }
  //   });
  //
  //   let { adminSigned } = updateTsweeklyDto; // user info from application that made the rest call
  //   const newUpdatedTsweeklyDto = new UpdateTsweeklyDto(); // new dto to update the database
  //
  //   if (userSigned1) {
  //     adminSigned = new Date();
  //   }
  //
  //   if (username === supervisor.supervisorEmail) {
  //
  //     // rest no admin signed / database admin signed
  //     if (!adminSigned && signed.adminSigned) {
  //
  //       newUpdatedTsweeklyDto.adminSigned = null;
  //     }
  //     // rest admin signed / database no admin signed
  //     else if (adminSigned && !signed.adminSigned) {
  //
  //       newUpdatedTsweeklyDto.adminSigned = new Date();
  //     } else if (!adminSigned) {
  //
  //       if (!signed.adminSigned) {
  //         throw new HttpException("No admin signature in database", HttpStatus.BAD_REQUEST);
  //       }
  //     }
  //     // rest admin signed and database admin signed
  //     else {
  //       throw new HttpException("Admin signature in database. Can not replace", HttpStatus.BAD_REQUEST);
  //     }
  //   }//username if
  //   // Unauthorized access
  //   else {
  //     throw new HttpException("You do not have permission.", HttpStatus.UNAUTHORIZED);
  //   }
  //
  //   return this.tsWeeklyRepository.updateTsweeklyAdmin(emailId, weekId, newUpdatedTsweeklyDto);
  // }
}
