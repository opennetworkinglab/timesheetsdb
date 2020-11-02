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
import { movePreviewToUnsigned } from '../google/util/move-preview';

@EntityRepository(Weekly)
export class WeeklyRepository extends Repository<Weekly> {

  async getWeekly(user: User, weekId: number): Promise<Weekly> {

    return await this.findOne({ where: { user: user, weekId: weekId } });
  }

  async createWeekly(user: User, updateWeeklyDto: UpdateWeeklyDto): Promise<void> {

    const { weekId } = updateWeeklyDto;

    const newWeekly = new Weekly();
    newWeekly.weekId = weekId;
    newWeekly.user = user;
    newWeekly.supervisorSigned = false;

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

    let weeklySigned = await this.findOne({ where: { user: user, weekId: weekId } });

    if(!weeklySigned){
      updateWeeklyDto.weekId = weekId;
      await this.createWeekly(user, updateWeeklyDto);
    }

    weeklySigned = await this.findOne({ where: { user: user, weekId: weekId } });

    // check supervisor has signed
    if(weeklySigned.supervisorSigned){
      throw new BadRequestException("Supervisor has signed");
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

  async updateWeeklyUserUnsign(user: User, weekId: number, googleArgs, updateWeeklyDto: UpdateWeeklyDto){

    const weeklySigned = await this.findOne({ where: { user: user, weekId: weekId }});

    const { userSigned } = updateWeeklyDto;

    if(!weeklySigned){
      updateWeeklyDto.weekId = weekId;
      await this.createWeekly(user, updateWeeklyDto);
    }

    if(weeklySigned.supervisorSigned){
      throw new BadRequestException("Supervisor has signed");
    }

    // check user has requested to unsign and if it is not signed
    if(!userSigned && !weeklySigned.userSigned){
      throw new BadRequestException("Has not been signed");
    }

    const googleShareUrlArr = googleArgs.googleShareUrl.split('IDLOCATION');
    const previewUrl = weeklySigned.preview;

    const previewId = previewUrl.replace(googleShareUrlArr[0], "");

    const moveFileArgs = {
      googleCredentials: googleArgs.googleCredentials,
      googleParent: googleArgs.googleParent,
      weekId: weekId,
      fileId: previewId
    }

    const moveFile = await movePreviewToUnsigned(user, moveFileArgs);

    if (moveFile.status !== 200) {
      console.log(moveFile);
    }

    return await this.update(
      {
        user: user,
        weekId: weekId
      }, {
        preview: null,
        userSigned: null
      });
  }

  async updateWeeklySupervisor(envelopID: string, documentUrl: string, previewUrl: string): Promise<UpdateResult>  {

    return await this.update(
      {
        userSigned: envelopID
      }, {
        preview: previewUrl,
        document: documentUrl,
        supervisorSigned: true
      });
  }
}
