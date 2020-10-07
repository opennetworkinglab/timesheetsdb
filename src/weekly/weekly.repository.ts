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

import { EntityRepository, getConnection, Repository, UpdateResult } from 'typeorm';

import { fromBuffer } from 'pdf2pic';

import { createReadStream, readFileSync } from 'fs';
import { Weekly } from './weekly.entity';
import { User } from '../auth/user.entity';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateWeeklyDto } from './dto/update-weekly.dto';
import { Week } from '../week/week.entity';
import { Day } from '../day/day.entity';
import { dayEntityTimesTo2DArray } from '../util/array/to-array';
import { signingViaEmail } from '../docusign/send-email-sign';
import { listEnvelopeDocuments } from '../docusign/list-envelope-documents';
import { downloadDocument } from '../docusign/download-document';
import { gDriveAuth } from '../gdrive/gdrive-auth';
import { gDriveUpload } from '../gdrive/gdrive-upload';

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

  async updateWeeklyUser(authArgs, user: User, weekId: number, updateWeeklyDto: UpdateWeeklyDto): Promise<UpdateResult> {

    const exists = await this.findOne({ where: { user: user, weekId: weekId } })

    if(!exists){
      updateWeeklyDto.weekId = weekId;
      await this.createWeekly(user, updateWeeklyDto);
    }

    const weeklySigned = await this.findOne({ where: { user: user, weekId: weekId } })

    // Testing
    // const days = await getConnection().getRepository(TsDay).find({ where: { tsUser: tsUser, weekId: weekId }})
    // const week = await getConnection().getRepository(TsWeek).findOne({ where: { id: weekId }})
    // const admin = await getConnection().getRepository(TsUser).findOne({ where: { email: tsUser.supervisorEmail }})
    //
    // const htmlArgs = {
    //     submitterEmail: tsUser.email,
    //     submitterName: tsUser.firstName + " " + tsUser.lastName,
    //     supervisorEmail: admin.email,
    //     supervisorName: admin.firstName + " " + admin.lastName,
    //     days: days,
    //     week: week,
    //     hours: null
    //   },
    //   args = {
    //     days: days,
    //     basePath: basePath,
    //     accountId: accountId,
    //     accessToken: token,
    //     htmlArgs: htmlArgs,
    //   }
    //
    // // const stuff = TsWeeklyService.createPdf(days, week);
    //
    // const envelopeId = await TsWeeklyRepository.sendEmail(args);
    //
    // return ;

    let signed;

    // check admin has signed
    if(weeklySigned.adminSigned){
      throw new BadRequestException("Admin has signed");
    }

    let { preview, userSigned } = updateWeeklyDto;

    // check user has requested to sign and if its already been signed
    if(userSigned && weeklySigned.userSigned){
      throw new BadRequestException("Already signed");
    }

    // check user has requested to unsign and if it is not signed
    if(!userSigned && !weeklySigned.userSigned){
      throw new BadRequestException("Has not been signed");
    }

    if(userSigned) {

      const week = await getConnection().getRepository(Week).findOne({ where: { id: weekId }})
      const days = await getConnection().getRepository(Day).find({ where: { user: user, weekId: weekId }})
      const admin = await getConnection().getRepository(User).findOne({ where: { email: user.supervisorEmail }})

      // TODO: CHECK ALL 7 DAYS EXIST

      const daysResult = dayEntityTimesTo2DArray(user, days)

      // args for document generation. The document to be signed
      const htmlArgs = {
          submitterEmail: user.email,
          submitterName: user.firstName + " " + user.lastName,
          supervisorEmail: admin.email,
          supervisorName: admin.firstName + " " + admin.lastName,
          days: daysResult,
          week: week,
        },
        signEmailArgs = {
          documentName: user.firstName + "_" + user.lastName + "_" + week.begin + "_" + week.end,
          basePath: authArgs.docusignBasePath,
          accountId: authArgs.docusignAccountId,
          accessToken: authArgs.docusignToken,
          htmlArgs: htmlArgs,
        };

      const envelope = await signingViaEmail.controller(signEmailArgs);

      signed = envelope.envelopeId;

      const retrieveDocArgs = {
        basePath: authArgs.docusignBasePath,
        accountId: authArgs.docusignAccountId,
        accessToken: authArgs.docusignToken,
        envelopeId: signed,
        documentId: null,
        envelopeDocuments: null
      }

      const documents = await listEnvelopeDocuments.worker(retrieveDocArgs);

      retrieveDocArgs.documentId = documents.envelopeDocuments[0].documentId;
      retrieveDocArgs.envelopeDocuments = documents.envelopeDocuments;

      const pdfDocument = await downloadDocument.worker(retrieveDocArgs);
      let saveName = pdfDocument.docName.split('.');
      saveName = saveName[0];

      const image = fromBuffer(Buffer.from(pdfDocument.fileBytes, 'binary'), {
        density: 100,
        format: "png",
        width: 600,
        height: 600,
        quality: 100,
        saveFilename: saveName,
        savePath: './images'
      });
      const result = await image(1);

      const gDriveArgs = {

        name: result.name,
        parents: [authArgs.googleParents],
        mimeType: 'image/png',
        body: createReadStream('./images/' + result.name)
      }

      const credentials = readFileSync('credentials.json');
      const oAuth2Client = await gDriveAuth.authorize(JSON.parse(credentials.toString('utf8')));

      const file  = await gDriveUpload.upload(oAuth2Client, gDriveArgs);

      const url  = authArgs.googleShareUrl;
      const urlSplit = url.split('id');
      preview = urlSplit[0] + file.data.id + urlSplit[1];

    }
    else{

      preview = null;

      userSigned = null;

    }

    return await this.update(
      {
        user: user,
        weekId: weekId
      }, {
        preview: preview,
        userSigned: signed
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