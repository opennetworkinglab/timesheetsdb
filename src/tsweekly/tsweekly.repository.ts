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
import { TsWeekly } from './tsweekly.entity';
import { CreateTsWeeklyDto } from './dto/create-tsweekly.dto';

import { BadRequestException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UpdateTsWeeklyDto } from './dto/update-tsweekly.dto';
import { TsUser } from '../auth/tsuser.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { TsUserRepository } from '../auth/tsuser.repository';

@EntityRepository(TsWeekly)
export class TsWeeklyRepository extends Repository<TsWeekly> {

  async createTsWeekly(tsUser: TsUser, createTsWeeklyDto: CreateTsWeeklyDto): Promise<void> {

    const { weekId } = createTsWeeklyDto;

    const tsWeekly = new TsWeekly();
    tsWeekly.weekId = weekId;
    tsWeekly.tsUser = tsUser;

    try {

      await tsWeekly.save();

    }catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTsWeekly(tsUser: TsUser): Promise<TsWeekly[]> {

    const query = this.createQueryBuilder('tsweekly');

    query.where('tsweekly.tsuseremail = :tsuseremail', { tsuseremail: tsUser.email});


    // Go through and convert blob
    // blobToFile ( ... );

    return await query.getMany();
  }

  async updateTsWeeklyUser(tsUser: TsUser, weekId: number, updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {

    const tsWeeklySigned = await this.findOne({ where: { tsUser: tsUser, weekId: weekId } })

    // check admin has signed
    if(tsWeeklySigned.adminSigned){
      throw new BadRequestException("Admin has signed");
    }

    let { document, preview, userSigned } = updateTsWeeklyDto;

    // check user has requested to sign and if its already been signed
    if(userSigned && tsWeeklySigned.userSigned){
      throw new BadRequestException("Already signed");
    }

    // check user has requested to unsign and if it is not signed
    if(!userSigned && !tsWeeklySigned.userSigned){
      throw new BadRequestException("Has not been signed");
    }

    if(userSigned) {

      if (!document) {
        document = tsWeeklySigned.document;
      }

      if (!preview) {
        preview = tsWeeklySigned.preview;
      }

      userSigned = new Date();
    }
    else{

      // save document to backup
      document = null;

      preview = null;

      userSigned = null;

    }

    return await this.update(
      {
        tsUser: tsUser,
        weekId: weekId
      }, {
        document: document,
        preview: preview,
        userSigned: userSigned
    });
  }

  async updateTsWeeklyAdmin(tsUserAdmin: TsUser, emailId: string, weekId: number, updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {

    if(!tsUserAdmin.isSupervisor){
      throw new UnauthorizedException();
    }

    const getUser = new TsUser();
    getUser.email = emailId;

    const isUserSupervisor = await this.findOne({ where: { tsUser: emailId, weekId: weekId } });

    if(String(isUserSupervisor.tsUser) !== tsUserAdmin.email && !isUserSupervisor.userSigned){
      throw new UnauthorizedException();
    }

    let { adminSigned } = updateTsWeeklyDto;

    // check admin has requested to sign and if its already been signed
    if(adminSigned && isUserSupervisor.adminSigned){
      throw new BadRequestException("Already signed");
    }

    // check admin has requested to unsign and if it is not signed
    if(!adminSigned && !isUserSupervisor.adminSigned){
      throw new BadRequestException("Has not been signed");
    }

    if(adminSigned){
      adminSigned = new Date();
    }
    else {
      adminSigned = null;
    }


    return await this.update(
      {
        tsUser: isUserSupervisor.tsUser,
        weekId: weekId
      }, {
        adminSigned: adminSigned
      });
  }

  // async getTsweeklyById(emailId: string): Promise<TsWeekly[]> {
  //
  //   const found = await this.find({ email: emailId });
  //
  //   if (!found) {
  //     throw new HttpException('Not in table', HttpStatus.BAD_REQUEST);
  //   }
  //
  //   return found;
  // }
}