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

import { EntityRepository, getConnection, In, Repository, UpdateResult } from 'typeorm';
import { Weekly } from './weekly.entity';
import { User } from '../auth/user.entity';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateWeeklyDto } from './dto/update-weekly.dto';
import { generateEnvelopeAndPreview, generatePdf } from '../docusign/util/generation/envelope-preview';
import { moveDocumentToUnsigned } from '../google/util/move-preview';
import { voidEnvelope } from '../docusign/void-envelope';
import { Day } from '../day/day.entity';
import { Week } from '../week/week.entity';


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
  async updateWeeklyUserSign(authArgs, user: User, weekId: number, googleParent: string, updateWeeklyDto: UpdateWeeklyDto): Promise< any > {

    let weeklySigned = await this.findOne({ where: { user: user, weekId: weekId } });
    const days = await getConnection().getRepository(Day).find({ where: { weekId: weekId}});
    const approverUser = await getConnection().getRepository(User).findOne( { where: { email: user.supervisorEmail}})

    if(days.length === 0){
      throw new BadRequestException("No days for this week have been filled");
    }

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

    // const results = await generateEnvelopeAndPreview(user, weekId, authArgs, googleParent, redirectUrl);
    const results = await generatePdf(user, approverUser, weekId, null, authArgs, googleParent)

    await this.update(
      {
        user: user,
        weekId: weekId
      }, {
        preview: results.preview,
        userSigned: 'set',
        userSignedDate: results.signedDate,
        rejected: false
      });

    return results;
  }

  async updateWeeklyUserUnsign(user: User, weekId: number, args, googleArgs, updateWeeklyDto: UpdateWeeklyDto){

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

    if ( weeklySigned.preview ) {

      const googleShareUrlArr = googleArgs.googleShareUrl.split('IDLOCATION');
      const previewUrl = weeklySigned.preview;

      const previewId = previewUrl.replace(googleShareUrlArr[0], '');

      const moveFileArgs = {
        googleCredentials: googleArgs.googleCredentials,
        googleParent: googleArgs.googleParent,
        weekId: weekId,
        fileId: previewId
      }

      // const docArgs = {
      //   basePath: args.docusignBasePath,
      //   accessToken: args.docusignToken,
      //   accountId: args.docusignAccountId
      // }

      // If the envelope has been signed by approver but the backend is not updated yet. this will catch it
      // A completed envelope cannot be voided. This will throw an error.
      // try {
      //   await voidEnvelope.send(docArgs, weeklySigned.userSigned);
      // }catch (e){
      //   throw new HttpException('Approver has already signed the timesheet', HttpStatus.BAD_REQUEST);
      // }

      const moveFile = await moveDocumentToUnsigned(moveFileArgs);

      if (moveFile.status !== 200) {
        console.log(moveFile);
      }

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

  async unsignWeeklyApprover(submittedUser: User, weekId: number){

    return await this.update(
      {
        user: submittedUser,
        weekId: weekId
      },
      {
        preview: null,
        document: null,
        supervisorSignedDate: null,
        supervisorSigned: false
      }
    )
  }

  async signWeeklyApprover(submittedUser: User, weekId: number, documentUrl: string, previewUrl: string, date: Date){

    return await this.update(
      {
        user: submittedUser,
        weekId: weekId
      }, {
        preview: previewUrl,
        document: documentUrl,
        supervisorSigned: true,
        supervisorSignedDate: date
      });
  }

  /**
   * Get the difference between week now and earliest non signed week (max 4 weeks in the past)
   * @param user
   */
  async getLastUnsignedWeeklyDiff(user: User): Promise<{ diff }>{

    const currentDate = new Date();
    let beginDateSubtract = 6;

    if(currentDate.getDay() != 0){
      beginDateSubtract = currentDate.getDay() - 1;
    }

    const dateBegin = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - beginDateSubtract)
    const weekMs = (60*60*24*7*1000)

    let queryWeeks = [];
    queryWeeks.push(dateBegin);
    queryWeeks.push(new Date(dateBegin.getTime() - weekMs));
    queryWeeks.push(new Date(dateBegin.getTime() - (weekMs * 2)));
    queryWeeks.push(new Date(dateBegin.getTime() - (weekMs * 3)));

    const weeks = await getConnection().getRepository(Week).find({
      where: {
        begin: In(queryWeeks)
      },
      order: {
        begin: 'DESC'
      }
    });

    const currentWeekId = weeks[0].id;
    queryWeeks = [];

    for(let i = 0; i < weeks.length; i++){
      queryWeeks.push(weeks[i].id);
    }

    const weeklies = await this.find({
      where: {
        user: user,
        weekId: In(queryWeeks)
      },
    order: {
        weekId: 'ASC'
    }});

    if(weeklies.length == 0){

      return {
        diff: -3
      }
    }
    else {

      let diff = -3;

      for (let i = 0; i < weeklies.length; i++) {

        const weekId = weeklies[i].weekId;

        if (weekId - currentWeekId === diff && weeklies[i].userSigned !== null) {
          diff++;
        }
      }
      if (diff > 0){
        diff = 0;
      }
      return {
        diff: diff
      }
    }
  }

  async rejectUsersWeekly(submitterUser: User, weekId: number, comment: string){
    return this.update({
      user: submitterUser,
      weekId: weekId
    },{
      preview: null,
      userSigned: null,
      userSignedDate: null,
      rejected: true,
      comment: comment
    });
  }

  async getRejectWeeks(user: User) {

    return  await this.find({
      where: {
        user: user,
        rejected: true
      },
    order: {
        weekId: 'ASC'
    }});
  }
}
