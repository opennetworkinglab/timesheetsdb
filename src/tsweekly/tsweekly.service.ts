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
import { TsweeklyRepository } from './tsweekly.repository';
import { FilterTsweeklyDto } from './dto/filter-tsweekly.dto';
import { Tsweekly } from './tsweekly.entity';
import { CreateTsweeklyDto } from './dto/create-tsweekly.dto';
import { UpdateTsweeklyDto } from './dto/update-tsweekly.dto';
import { UpdateResult } from 'typeorm';

import { TsuserRepository } from '../tsuser/tsuser.repository';


@Injectable()
export class TsweeklyService {

  constructor(
    @InjectRepository(TsweeklyRepository)
    private tsweeklyRepository: TsweeklyRepository,
    @InjectRepository(TsuserRepository) private tsuserRepository: TsuserRepository) {}

  /**
   * Returns a Promise of an array of Tsweekly based on filter. One to many Tsweekly can be returned.
   * @param filterTsweeklyDto
   */
  async getTsweekly(filterTsweeklyDto: FilterTsweeklyDto): Promise<Tsweekly[]> {
    return this.tsweeklyRepository.getTsweekly(filterTsweeklyDto);
  }

  async getTsweeklyById(emailId: string): Promise<Tsweekly[]> {
    return this.tsweeklyRepository.getTsweeklyById(emailId);
  }

  async createTsweekly(createTsweeklyDto: CreateTsweeklyDto): Promise<void> {
    return this.tsweeklyRepository.createTsweekly(createTsweeklyDto);
  }
  
  /**
   * Updates the tsweekly (document/ preview/ usersigned) based on the email and weekid. Checks that the caller has authorization to do so.
   * @param username
   * @param emailId
   * @param weekId
   * @param updateTsweeklyDto
   * @param userSigned1
   */
  async updateTsweeklyUser(username: string, emailId: string, weekId: number, updateTsweeklyDto: UpdateTsweeklyDto, userSigned1: string): Promise<UpdateResult> {

    const signed = await this.tsweeklyRepository.findOne({
      select: ['weekid', 'userSigned', 'adminSigned'],
      where: { email: emailId, weekid: weekId }
    }); // Getting user signed and admin signed columns

    let { userSigned } = updateTsweeklyDto; // user info from application that made the rest call
    const newUpdatedTsweeklyDto = new UpdateTsweeklyDto(); // new dto to update the database

    if(userSigned1) {
      userSigned = new Date();
    }

    if(username === emailId) {

      // rest call: user not signed / database: admin not signed - user signed
      if(!userSigned &&  !signed.adminSigned && signed.userSigned){

        const docAndPrev = await this.tsweeklyRepository.findOne({
          select: ['document', 'preview'],
          where: { email: emailId, weekid: weekId }
        });

        // Move document to old folder
        // remove preview

        newUpdatedTsweeklyDto.document = null;
        newUpdatedTsweeklyDto.preview = null;
        newUpdatedTsweeklyDto.userSigned = null;
      }
      // rest call: user signed / database: user not signed
      else if(userSigned && !signed[0].userSigned){

        // create document and save to gdrive
        // create preview

        newUpdatedTsweeklyDto.document = "New";
        newUpdatedTsweeklyDto.preview = "new";
        newUpdatedTsweeklyDto.userSigned = new Date();
      }
      // If the rest user signed is null but the admin has signed or the user signed column is empty
      else if (!userSigned){

        if(signed[0].adminSigned) {
            throw new HttpException("Supervisor has already signed", HttpStatus.UNAUTHORIZED);
        }
        throw new HttpException("No user signature in database", HttpStatus.BAD_REQUEST);
      }
      // rest user signed and user signed column is not empty
      else{
        throw new HttpException("User signature in database. Can not replace", HttpStatus.BAD_REQUEST);
      }
    }
    // Unauthorized access
    else{
      throw new HttpException("You do not have permission.", HttpStatus.UNAUTHORIZED);
    }

    return this.tsweeklyRepository.updateTsweeklyUser(emailId, weekId, newUpdatedTsweeklyDto);
  }

  /**
   * Updates the tsweekly (admin signed) based on the email and weekid. Checks that the caller has authorization to do so.
   * @param username
   * @param emailId
   * @param weekId
   * @param updateTsweeklyDto
   * @param userSigned1
   */
  async updateTsweeklyAdmin(username: string, emailId: string, weekId: number, updateTsweeklyDto: UpdateTsweeklyDto, userSigned1: string): Promise<UpdateResult> {

    const signed = await this.tsweeklyRepository.findOne({
      select: ['weekid', 'adminSigned'],
      where: { email: emailId, weekid: weekId }
    }); // Getting admin signed columns

    const supervisor = await this.tsuserRepository.findOne({
      select: ['supervisoremail'],
      where: { email: emailId }
    });

    let { adminSigned } = updateTsweeklyDto; // user info from application that made the rest call
    const newUpdatedTsweeklyDto = new UpdateTsweeklyDto(); // new dto to update the database

    if(userSigned1) {
      adminSigned = new Date();
    }

    if(username === supervisor.supervisoremail) {

      // rest no admin signed / database admin signed
      if(!adminSigned && signed.adminSigned ) {

        newUpdatedTsweeklyDto.adminSigned = null;
      }
      // rest admin signed / database no admin signed
      else if (adminSigned && !signed.adminSigned) {

        newUpdatedTsweeklyDto.adminSigned = new Date();
      }
      else if (!adminSigned){

        if(!signed.adminSigned) {
          throw new HttpException("No admin signature in database", HttpStatus.BAD_REQUEST);
        }
      }
      // rest admin signed and database admin signed
      else{
        throw new HttpException("Admin signature in database. Can not replace", HttpStatus.BAD_REQUEST);
      }

    }
    // Unauthorized access
    else{
      throw new HttpException("You do not have permission.", HttpStatus.UNAUTHORIZED);
    }

     return this.tsweeklyRepository.updateTsweeklyAdmin(emailId, weekId, newUpdatedTsweeklyDto);
  }

}