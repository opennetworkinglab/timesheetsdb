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
import { Weekly } from './weekly.entity';
import { User } from '../auth/user.entity';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateWeeklyDto } from './dto/update-weekly.dto';
import { generateEnvelopeAndPreview } from '../docusign/util/generation/envelope-preview';
import { getUserAndContentFolderIds } from '../gdrive/util/get-user-and-content-folder-ids';

@EntityRepository(Weekly)
export class WeeklyRepository extends Repository<Weekly> {

  async getWeeklies(user: User): Promise<Weekly[]> {

    return await this.find({ where: { user: user } });
  }

  async createWeekly(user: User, updateWeeklyDto: UpdateWeeklyDto): Promise<void> {

    const { weekId } = updateWeeklyDto;

    const newWeekly = new Weekly();
    newWeekly.weekId = weekId;
    newWeekly.user = user;

    try {

      await newWeekly.save();

    }catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   *
   * @param authArgs docusignToken, docusignBasePath, docusignAccountId, googleShareUrl, googleCredentials
   * @param user
   * @param weekId
   * @param googleParent Main parent folder
   * @param updateWeeklyDto
   */
  async updateWeeklyUserSign(authArgs, user: User, weekId: number, googleParent: string, updateWeeklyDto: UpdateWeeklyDto): Promise<UpdateResult> {

    const exists = await this.findOne({ where: { user: user, weekId: weekId } });

    if(!exists){
      updateWeeklyDto.weekId = weekId;
      await this.createWeekly(user, updateWeeklyDto);
    }

    const weeklySigned = await this.findOne({ where: { user: user, weekId: weekId } });

    // check admin has signed
    if(weeklySigned.adminSigned){
      throw new BadRequestException("Admin has signed");
    }

    const { userSigned } = updateWeeklyDto;

    // check user has requested to sign and if its already been signed
    if(userSigned && weeklySigned.userSigned){
      throw new BadRequestException("Already signed");
    }

    const results = await generateEnvelopeAndPreview(user, weekId, authArgs, googleParent);

    return await this.update(
      {
        user: user,
        weekId: weekId
      }, {
        preview: results.preview,
        userSigned: results.signed
      });
  }

  async updateWeeklyUserUnsign(user: User, weekId: number, googleCredentials, updateWeeklyDto: UpdateWeeklyDto){

    const exists = await this.findOne({ where: { user: user, weekId: weekId }});
    const weeklySigned = await this.findOne({ where: { user: user, weekId: weekId }});

    const { userSigned } = updateWeeklyDto;

    if(!exists){
      updateWeeklyDto.weekId = weekId;
      await this.createWeekly(user, updateWeeklyDto);
    }

    // check user has requested to unsign and if it is not signed
    if(!userSigned && !weeklySigned.userSigned){
      throw new BadRequestException("Has not been signed");
    }

    const userFolder = getUserAndContentFolderIds()

    return await this.update(
      {
        user: user,
        weekId: weekId
      }, {
        preview: null,
        userSigned: null
      });
  }

  async updateWeeklyAdmin(envelopID: string, url: string, preview: string): Promise<UpdateResult>  {

    return await this.update(
      {
        userSigned: envelopID
      }, {
        preview: preview,
        document: url,
        adminSigned: true
      });
  }
}