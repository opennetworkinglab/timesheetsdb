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
import { TsWeekly } from './tsweekly.entity';
import { BadRequestException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UpdateTsWeeklyDto } from './dto/update-tsweekly.dto';
import { TsUser } from '../auth/tsuser.entity';
import { TsDay } from '../tsday/tsday.entity';
import { TsWeek } from '../tsweek/tsweek.entity';
import { signingViaEmail } from './docusign/send-email-sign';
import { listEnvelopeDocuments } from './docusign/list-envelope-documents';
import { downloadDocument } from './docusign/download-document';
import { fromBuffer } from 'pdf2pic';

import { createReadStream, readFileSync } from 'fs';
import { gDriveAuth } from './gdrive/gdrive-auth';
import { gDriveUpload } from './gdrive/gdrive-upload';
import { TsWeeklyService } from './tsweekly.service';
import { Type } from 'class-transformer';


@EntityRepository(TsWeekly)
export class TsWeeklyRepository extends Repository<TsWeekly> {

  async createTsWeekly(tsUser: TsUser, updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<void> {

    const { weekId } = updateTsWeeklyDto;

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

    const result =  await this.find({ where: { tsUser: tsUser } });

    for(let i = 0; i < result.length; i++){
      result[i].preview = 'data:image/png;base64,' + result[i].preview;
    }

    return result;
  }

  async updateTsWeeklyUser(token, basePath, accountId, tsUser: TsUser, weekId: number, updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {

    const exists = await this.findOne({ where: { tsUser: tsUser, weekId: weekId } })

    if(!exists){
      updateTsWeeklyDto.weekId = weekId;
      await this.createTsWeekly(tsUser, updateTsWeeklyDto);
    }

    const tsWeeklySigned = await this.findOne({ where: { tsUser: tsUser, weekId: weekId } })

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
    if(tsWeeklySigned.adminSigned){
      throw new BadRequestException("Admin has signed");
    }

    let { preview, userSigned } = updateTsWeeklyDto;

    // check user has requested to sign and if its already been signed
    if(userSigned && tsWeeklySigned.userSigned){
      throw new BadRequestException("Already signed");
    }

    // check user has requested to unsign and if it is not signed
    if(!userSigned && !tsWeeklySigned.userSigned){
      throw new BadRequestException("Has not been signed");
    }

    if(userSigned) {

      const week = await getConnection().getRepository(TsWeek).findOne({ where: { id: weekId }})
      const days = await getConnection().getRepository(TsDay).find({ where: { tsUser: tsUser, weekId: weekId }})
      const admin = await getConnection().getRepository(TsUser).findOne({ where: { email: tsUser.supervisorEmail }})

      // args for document generation. The document to be signed
      const htmlArgs = {
        submitterEmail: tsUser.email,
        submitterName: tsUser.firstName + " " + tsUser.lastName,
        supervisorEmail: admin.email,
        supervisorName: admin.firstName + " " + admin.lastName,
        days: days,
        week: week,
        hours: null
        },
        args = {
          documentName: tsUser.firstName + "_" + tsUser.lastName + "_" + week.begin + "_" + week.end,
          days: days,
          basePath: basePath,
          accountId: accountId,
          accessToken: token,
          htmlArgs: htmlArgs,
        }

      const envelopeId = await TsWeeklyRepository.sendEmail(args);

      signed = envelopeId.envelopeId;

      const retrieveDocArgs = {
        basePath: basePath,
        accessToken: token,
        accountId: accountId,
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
        parents: ['1P1NdO2n-inmQz5WDBgoq5vA4SO11z__n'],
        mimeType: 'image/png',
        body: createReadStream('./images/' + result.name)
      }

      const credentials = readFileSync('credentials.json');
      const oAuth2Client = await gDriveAuth.authorize(JSON.parse(credentials.toString('utf8')));

      const file  = await gDriveUpload.upload(oAuth2Client, gDriveArgs);

      const url  = 'https://drive.google.com/file/d/id/view';
      const urlSplit = url.split('id');
      preview = urlSplit[0] + file.data.id + urlSplit[1];

    }
    else{

      preview = null;

      userSigned = null;

    }

    return await this.update(
      {
        tsUser: tsUser,
        weekId: weekId
      }, {
        preview: preview,
        userSigned: signed
    });
  }

  async updateTsWeeklyAdmin(envelopID: string, url: string, preview: string): Promise<UpdateResult>  {

    return await this.update(
      {
        userSigned: envelopID
      }, {
        preview: preview,
        document: url,
        adminSigned: true
      });
  }

  private static async sendEmail(args){

    // 2D-array holding the values of time spent on each project. As well the totals. Time in decimal
    const cellValues = [];
    for(let i = 0; i < 7; i++){

      cellValues[i] = [];

      cellValues[i][0] = args.days[i].darpaMins / 60
      cellValues[i][1] = args.days[i].nonDarpaMins / 60;
      cellValues[i][2] = args.days[i].sickMins / 60
      cellValues[i][3] = args.days[i].ptoMins / 60
      cellValues[i][4] = args.days[i].holidayMins / 60
      cellValues[i][5] = (args.days[i].darpaMins / 60) + (args.days[i].nonDarpaMins / 60) + (args.days[i].sickMins / 60) + (args.days[i].ptoMins / 60) + (args.days[i].holidayMins / 60);
    }
    // project total across all days
    cellValues[7] = [];
    for(let i = 0; i < 6; i++){

      cellValues[7][i] = cellValues[0][i] + cellValues[1][i] + cellValues[2][i] + cellValues[3][i] +
        cellValues[4][i] + cellValues[5][i] + cellValues[6][i];
    }
    // converting the times to string format
    for(let i = 0; i < cellValues.length; i++){
      for(let j = 0; j < cellValues[i].length; j++){

        cellValues[i][j] = cellValues[i][j].toString();
      }
    }

    args.htmlArgs.hours = cellValues;
    args.htmlArgs.week.begin = TsWeeklyRepository.dateFormat(args.htmlArgs.week.begin);
    args.htmlArgs.week.end = TsWeeklyRepository.dateFormat(args.htmlArgs.week.end);

    return await signingViaEmail.controller(args);
  }

  private static dateFormat(date): string{

    const dateArr = date.split("-");

    // month/day/year
    return dateArr[1] + "/" + dateArr[2] + "/" +dateArr[0] ;
  }
}