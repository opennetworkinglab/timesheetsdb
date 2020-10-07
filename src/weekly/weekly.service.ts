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
import { Readable } from 'stream';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { fromBuffer } from 'pdf2pic';
import { WeeklyRepository } from './weekly.repository';
import { ConfigService } from '@nestjs/config';
import { User } from '../auth/user.entity';
import { Weekly } from './weekly.entity';
import { UpdateWeeklyDto } from './dto/update-weekly.dto';
import { createReadStream, readFileSync } from 'fs';
import { listEnvelopes } from '../docusign/list-envelopes';
import { listEnvelopeDocuments } from '../docusign/list-envelope-documents';
import { downloadDocument } from '../docusign/download-document';
import { gDriveAuth } from '../gdrive/gdrive-auth';
import { gDriveUpload } from '../gdrive/gdrive-upload';

// const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// const weekdays = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun", "Total"];

@Injectable()
export class WeeklyService {

  constructor(
    @InjectRepository(WeeklyRepository)
    private weeklyRepository: WeeklyRepository,
    private configService: ConfigService) {}

  async createTsWeekly(): Promise<void> {

    // return this.tsWeeklyRepository.createTsWeekly(tsUser, createTsWeeklyDto);
  }

  async getWeekly(user: User): Promise<Weekly[]> {
    return this.weeklyRepository.getWeeklies(user);
  }

  async updateWeeklyUser(user: User, weekId: number, updateWeeklyDto: UpdateWeeklyDto): Promise<UpdateResult> {

    const token = await this.getDocusignToken();

    const authArgs = {
      docusignToken: token.data.access_token,
      docusignBasePath: this.configService.get<string>('DOCUSIGN_BASE_PATH'),
      docusignAccountId: this.configService.get<string>('DOCUSIGN_ACCOUNT_ID'),
      googleParents: this.configService.get<string>('GOOGLE_DOC_PARENT_FOLDER'),
      googleShareUrl: this.configService.get<string>('GOOGLE_DOC_URL_TEMPLATE')
    }

    return await this.weeklyRepository.updateWeeklyUser(authArgs, user, weekId, updateWeeklyDto);
  }

  async updateWeeklyAdmin() {

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

      const result = await this.weeklyRepository.updateWeeklyAdmin(args.envelopeId, url, preview);

      updates +=  Number(result.affected);
    }

    // I am a teapot!
    throw new HttpException(updates + " updated", HttpStatus.I_AM_A_TEAPOT);
  }

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