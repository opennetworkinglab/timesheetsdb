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
import { UpdateResult } from 'typeorm';
import { TsWeeklyRepository } from './tsweekly.repository';
import { TsWeekly } from './tsweekly.entity';
import { UpdateTsWeeklyDto } from './dto/update-tsweekly.dto';
import { TsUser } from '../auth/tsuser.entity';
import { createReadStream, readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { gDriveAuth } from './gdrive/gdrive-auth';
import { gDriveUpload } from './gdrive/gdrive-upload';
import { listEnvelopes } from './docusign/list-envelopes';
import { listEnvelopeDocuments } from './docusign/list-envelope-documents';
import { downloadDocument } from './docusign/download-document';
import { Readable } from 'stream';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { fromBuffer } from 'pdf2pic';

// const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// const weekdays = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun", "Total"];

@Injectable()
export class TsWeeklyService {

  constructor(
    @InjectRepository(TsWeeklyRepository)
    private tsWeeklyRepository: TsWeeklyRepository,
    private configService: ConfigService) {}

  async createTsWeekly(): Promise<void> {

      // return this.tsWeeklyRepository.createTsWeekly(tsUser, createTsWeeklyDto);
  }

  async getTsWeekly(tsUser: TsUser): Promise<TsWeekly[]> {
    return this.tsWeeklyRepository.getTsWeekly(tsUser);
  }

  async updateTsWeeklyUser(tsUser: TsUser, weekId: number, updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {

    const token = await this.getDocusignToken();
    const basePath = this.configService.get<string>('DOCUSIGN_BASE_PATH');
    const accountId = this.configService.get<string>('DOCUSIGN_ACCOUNT_ID');

    return await this.tsWeeklyRepository.updateTsWeeklyUser(token.data.access_token, basePath, accountId, tsUser, weekId, updateTsWeeklyDto);
  }

  async updateTsWeeklyAdmin() {

    let updates = 0;
    const token = await this.getDocusignToken();
    const basePath = this.configService.get<string>('DOCUSIGN_BASE_PATH');
    const accountId = this.configService.get<string>('DOCUSIGN_ACCOUNT_ID');

    const args = {
      basePath: basePath,
      accessToken: token.data.access_token,
      accountId: accountId,
      envelopeId: null,
      documentId: null,
      envelopeDocuments: null
    }

    const envelopes = await listEnvelopes.worker(args);

    if(Number(envelopes.resultSetSize) == 0){
      // I am a teapot!
      throw new HttpException(updates + " updated", HttpStatus.I_AM_A_TEAPOT);
    }

    for (let i = 0; i < Number(envelopes.resultSetSize); i++) {//envelopes.resultSetSize

      args.envelopeId = envelopes.envelopes[i].envelopeId;

      const documents = await listEnvelopeDocuments.worker(args);

      args.documentId = documents.envelopeDocuments[0].documentId;
      args.envelopeDocuments = documents.envelopeDocuments;

      const pdfDocument = await downloadDocument.worker(args);

      const readableInstanceStream = new Readable({
        read() {
          this.push(Buffer.from(pdfDocument.fileBytes, 'binary'));
          this.push(null);
        }
      });

      const gDriveArgs = {
        name: pdfDocument.docName,
        parents: [this.configService.get<string>('GOOGLE_DOC_PARENT_FOLDER')],
        mimeType: 'image/pdf',
        body: readableInstanceStream  // 20200217 2020-02-17
      }

      const credentials = readFileSync('credentials.json');
      const oAuth2Client = await gDriveAuth.authorize(JSON.parse(credentials.toString('utf8')));

      let file  = await gDriveUpload.upload(oAuth2Client, gDriveArgs);

      let url  = this.configService.get<string>('GOOGLE_DOC_URL_TEMPLATE');
      let urlSplit = url.split('id');
      url = urlSplit[0] + file.data.id + urlSplit[1];

      // TODO: GENERATE PREVIEW

      url  = this.configService.get<string>('GOOGLE_DOC_URL_TEMPLATE');;
      urlSplit = url.split('id');
      const preview = urlSplit[0] + file.data.id + urlSplit[1];

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
      const imResult = await image(1);

      gDriveArgs.name = imResult.name,
      gDriveArgs.parents = ['1P1NdO2n-inmQz5WDBgoq5vA4SO11z__n'],
      gDriveArgs.mimeType = 'image/png',
      gDriveArgs. body = createReadStream('./images/' + imResult.name)

      file  = await gDriveUpload.upload(oAuth2Client, gDriveArgs);

      const result = await this.tsWeeklyRepository.updateTsWeeklyAdmin(args.envelopeId, url, preview);

      updates +=  Number(result.affected);
    }

    // I am a teapot!
    throw new HttpException(updates + " updated", HttpStatus.I_AM_A_TEAPOT);
  }

  // public static async createPdf(days: TsDay[], week: TsWeek){
  //
  //   const pdfDoc = await PDFDocument.create()
  //   const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  //   const page = pdfDoc.addPage([841.89, 595.28]);
  //   const form = pdfDoc.getForm()
  //   // const page = pdfDoc.addPage(PageSizes.A4);
  //   const pdfPageEditor = new PdfPageEditor(page);
  //
  //   pdfPageEditor.addText(20, 40, timesRomanFont, 25, rgb(0, 0.53, 0.71), days[0].tsUser.firstName + " " + days[0].tsUser.lastName + ": " + days[0].tsUser.email);
  //   pdfPageEditor.addText(20, 85, timesRomanFont, 15, rgb(0, 0.53, 0.71), 'Week: ' + TsWeeklyService.dateFormat(week.begin.toString()) + " - " + TsWeeklyService.dateFormat(week.end.toString()) + "\tWeek no: " + week.weekNo);
  //
  //   pdfPageEditor.tableStart(20, 100);
  //   pdfPageEditor.addColumns(90, 1);
  //   pdfPageEditor.addColumns(90, 8);
  //   pdfPageEditor.addHeaderRow(60);
  //   pdfPageEditor.addRows(30, 1);
  //   pdfPageEditor.addRows(40, 6);
  //   pdfPageEditor.drawTable(rgb(0.256, 0.256, 0.256), 1, 5);
  //
  //   const rowTitles = ["Date", "Darpa\nHR001120C0107", "Non Darpa", "Sick", "PTO", "Holiday", "Total"];
  //   pdfPageEditor.populateRowHeadings(rowTitles, timesRomanFont, 12, rgb(0, 0.53, 0.71));
  //
  //   // Convert dates to string and months to word
  //   const dateString = []
  //   for(let i = 0; i < days.length; i++){
  //
  //     const date = days[i].day.toString().split("-");
  //
  //     dateString.push([date[2], months[Number(date[1]) - 1], date[0]]);
  //   }
  //   const dates = [dateString[0], dateString[1], dateString[2], dateString[3], dateString[4], dateString[5], dateString[6]];
  //   pdfPageEditor.populateColumnHeadings(dates, timesRomanFont, 12, rgb(0, 0.53, 0.71));
  //
  //   pdfPageEditor.populateHeader("Hours", weekdays, timesRomanFont, 15, 13, rgb(0, 0.53, 0.71));
  //
  //   const cellValues = [];
  //   for(let i = 0; i < 7; i++){
  //
  //     cellValues[i] = [];
  //
  //     cellValues[i][0] = days[i].darpaMins / 60
  //     cellValues[i][1] = days[i].nonDarpaMins / 60;
  //     cellValues[i][2] = days[i].sickMins / 60
  //     cellValues[i][3] = days[i].ptoMins / 60
  //     cellValues[i][4] = days[i].holidayMins / 60
  //     cellValues[i][5] = (days[i].darpaMins / 60) + (days[i].nonDarpaMins / 60) + (days[i].sickMins / 60) + (days[i].ptoMins / 60) + (days[i].holidayMins / 60);
  //   }
  //   cellValues[7] = [];
  //   for(let i = 0; i < 6; i++){
  //
  //     cellValues[7][i] = cellValues[0][i] + cellValues[1][i] + cellValues[2][i] + cellValues[3][i] +
  //       cellValues[4][i] + cellValues[5][i] + cellValues[6][i];
  //   }
  //   for(let i = 0; i < cellValues.length; i++){
  //     for(let j = 0; j < cellValues[i].length; j++){
  //
  //       cellValues[i][j] = cellValues[i][j].toString();
  //     }
  //   }
  //   pdfPageEditor.populateCells(cellValues, timesRomanFont, 12, rgb(0, 0.53, 0.71))
  //   pdfPageEditor.addSign(form);
  //
  //   // Serialize the PDFDocument to bytes (a Uint8Array)
  //   const pdfBytes = await pdfDoc.save();
  //   // const pdfBytes = await pdfDoc.saveAsBase64();
  //
  //   writeFileSync('ss.pdf', pdfBytes); // writing the file locally
  // }

  async getDocusignToken(){

    const privateKey = readFileSync('private.key');

    const payload = {
      "iss": this.configService.get<string>('DOCUSIGN_ISS'),
      "sub": this.configService.get<string>('DOCUSIGN_SUB'),
      "name": this.configService.get<string>('NAME'),
      "aud": this.configService.get<string>('DOCUSIGN_AUD'),
      "iat": Math.floor(new Date().getTime() / 1000),
      "exp": Math.floor((new Date().getTime() + 1000000) / 1000),
      "scope": this.configService.get<string>('DOCUSIGN_SCOPE')
    }

    const tokenUrl = this.configService.get<string>('DOCUSIGN_TOKEN_URL');

    const jwtToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
    });

    return await axios.post(tokenUrl, {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken
      }
    );
  }
}
