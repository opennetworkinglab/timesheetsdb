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
import { getConnection, In, MoreThan } from 'typeorm';
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
import { auth } from '../google/auth';
import { tmpdir } from "os";
import { upload } from '../google/gdrive/upload';
import { getUserContentFolderIds } from '../google/util/get-user-content-folder-ids';
import { Week } from '../week/week.entity';
import { formatArrayYYMMDD } from '../util/date/date-formating';
import { sendEmail } from '../google/gmail/send-email';

// noinspection DuplicatedCode
@Injectable()
export class WeeklyService {

  constructor(
    @InjectRepository(WeeklyRepository)
    private weeklyRepository: WeeklyRepository,
    private configService: ConfigService) {
  }

  async getWeekly(user: User, weekId: number): Promise<Weekly> {
    return this.weeklyRepository.getWeekly(user, weekId);
  }

  async updateWeeklyUser(user: User, weekId: number, updateWeeklyDto: UpdateWeeklyDto, redirectUrl: string): Promise<{ viewRequest }> {

    const { userSigned } = updateWeeklyDto;

    const googleCredentials = await this.getGoogleCredentials();
    const googleShareUrl = this.configService.get<string>('GOOGLE_DOC_URL_TEMPLATE');
    const googleParent = this.configService.get<string>('GOOGLE_DOC_PARENT_FOLDER');

    const token = await this.getDocusignToken();

    const authArgs = {
      docusignToken: token.data.access_token,
      docusignBasePath: this.configService.get<string>('DOCUSIGN_BASE_PATH'),
      docusignAccountId: this.configService.get<string>('DOCUSIGN_ACCOUNT_ID'),
      googleParents: this.configService.get<string>('GOOGLE_DOC_PARENT_FOLDER'),
      googleShareUrl: googleShareUrl,
      googleCredentials: googleCredentials
    }

    if(userSigned){

      return await this.weeklyRepository.updateWeeklyUserSign(authArgs, user, weekId, googleParent, updateWeeklyDto, redirectUrl);
    }

    const googleArgs = {
      googleCredentials: googleCredentials,
      googleShareUrl: googleShareUrl,
      googleParent: googleParent
    }

    await this.weeklyRepository.updateWeeklyUserUnsign(user, weekId, authArgs, googleArgs, updateWeeklyDto);
    return { viewRequest: null };
  }

  async updateWeeklySupervisor() {

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

    if (Number(envelopes.resultSetSize) == 0) {
      // I am a teapot!
      throw new HttpException(updates + " updated", HttpStatus.I_AM_A_TEAPOT);
    }

    for (let i = 0; i < Number(envelopes.resultSetSize); i++) {

      //-- Get envelope and download document
      args.envelopeId = envelopes.envelopes[i].envelopeId;

      // Getting necessary information to get user folder to save in
      const weekly = await getConnection().getRepository(Weekly).findOne({ where: { userSigned: args.envelopeId }});
      const week = await getConnection().getRepository(Week).findOne({ where: { id: weekly.weekId }});
      let weekStart = formatArrayYYMMDD(week.begin);
      const weekEnd = formatArrayYYMMDD(week.end);
      weekStart = weekStart[1] + "-" + weekStart[2]
      const month = weekEnd[1];
      const year = weekEnd[0];

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
      //-------

      //-- Upload to Google
      const credentials = await this.getGoogleCredentials();
      const oAuth2Client = await auth.authorize(credentials);

      const userFolderArgs = {
        searchTerm: [weekStart, month, year],
        parent: this.configService.get<string>('GOOGLE_DOC_PARENT_FOLDER')
      }
      const userFolder = await getUserContentFolderIds(oAuth2Client,userFolderArgs, userFolderArgs.searchTerm.length - 1);

      // Save document to drive
      const gDriveArgs = {
        name: pdfDocument.docName,
        parents: [userFolder.userFolder],
        mimeType: 'image/pdf',
        body: readableInstanceStream
      }

      let file = await upload.worker(oAuth2Client, gDriveArgs);

      // Get document url to save to DB
      let url = this.configService.get<string>('GOOGLE_DOC_URL_TEMPLATE');
      let urlSplit = url.split('IDLOCATION');
      const documentUrl = urlSplit[0] + file.data.id;

      // Save preview of document in PNG
      let saveName = pdfDocument.docName.split('.');
      saveName = saveName[0];

      const tempDir = tmpdir();

      const image = fromBuffer(Buffer.from(pdfDocument.fileBytes, 'binary'), {
        density: 100,
        format: "png",
        width: 600,
        height: 600,
        quality: 100,
        saveFilename: saveName,
        savePath: tempDir
      });
      const imResult = await image(1);

      const imResultSplit = imResult.name.split('.');

      const imResultName = imResultSplit[0] + "-completed." + imResultSplit[2];

      // Save preview to drive
      gDriveArgs.name = imResultName;
      gDriveArgs.parents = [userFolder.imagesFolder];
      gDriveArgs.mimeType = 'image/png';
      gDriveArgs.body = createReadStream(tempDir +  "/" + imResult.name);

      file = await upload.worker(oAuth2Client, gDriveArgs);

      // Get url to save to DB for preview png image
      url = this.configService.get<string>('GOOGLE_DOC_URL_TEMPLATE');
      urlSplit = url.split('IDLOCATION');
      const preview = urlSplit[0] + file.data.id;

      const result = await this.weeklyRepository.updateWeeklySupervisor(args.envelopeId, documentUrl, preview);

      updates += Number(result.affected);
    }

    // I am a teapot!
    throw new HttpException(updates + " updated", HttpStatus.I_AM_A_TEAPOT);
  }

  async getGoogleCredentials() {

    const redirectUris = this.configService.get<string>('GOOGLE_REDIRECT_URIS').split(', ');

    return {
      "installed": {
        "client_id": this.configService.get<string>('GOOGLE_CLIENT_ID'),
        "project_id": this.configService.get<string>('GOOGLE_PROJECT_ID'),
        "auth_uri": this.configService.get<string>('GOOGLE_AUTH_URI'),
        "token_uri": this.configService.get<string>('GOOGLE_TOKEN_URI'),
        "auth_provider_x509_cert_url": this.configService.get<string>('GOOGLE_AUTH_PROVIDER_X509_CERT_URL'),
        "client_secret": this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        "redirect_uris": redirectUris
      }
    }
  }

  async getDocusignToken() {

    const privateKey = readFileSync('docusignPrivate.key');

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

  async userReminderEmails(){

    const users = await getConnection().getRepository(User).find({ select: ['email'], where: { isActive: true }});

    const currentDate = new Date();

    const week = await getConnection().getRepository(Week).findOne({ where: { end: currentDate }});

    const cred = await this.getGoogleCredentials();

    const oAuth2Client = await auth.authorize(cred);

    for(let i = 0; i < users.length; i++){

      const weekly = await getConnection().getRepository(Weekly).findOne({ where: { user: users[i].email, weekId: week.id }});

      const emailArgs = {
        userEmail: users[i].email,
        message: 'Please complete timesheet for week beginning ' + week.begin,
        subject: 'Complete Timesheet week: ' + week.begin
      }

      if(weekly){

        if(weekly.userSigned.length === 0){
          await sendEmail.worker(oAuth2Client, emailArgs);
        }
      }
      else {
        await sendEmail.worker(oAuth2Client, emailArgs);
      }
    }
  }

  async approverEmail(){

    const approverUsers: User[] = await getConnection().getRepository(User).find({ where: [{ isSupervisor: true}]});

    // loop and send sign email for all approved users where there users have signed
    for(let i = 0; i < 1; i++){//approverUsers.length; i++){

      const users = await getConnection().getRepository(User).find({ select: ['email'], where: { supervisorEmail: approverUsers[0].email }});
      const queryUsers = [];

      for(let i = 0; i < users.length; i++){
        queryUsers.push(users[i].email);
      }

      const date = new Date(2020, 10, 29);

      const week = await getConnection().getRepository(Week).findOne({ where: [
          { end: MoreThan(date)},
          { end: date }
        ]});

      const envelopeIds = await getConnection().getRepository(Weekly).find( {
        select: [ 'userSigned' ],
        where: [
          {
            weekId: week.id,
            user: In(queryUsers) // get all ids for users in array
          }
        ]});

      console.log(envelopeIds);
    }

    // const token = await this.getDocusignToken();
    //
    // const authArgs = {
    //   accessToken: token.data.access_token,
    //   basePath: this.configService.get<string>('DOCUSIGN_BASE_PATH'),
    //   accountId: this.configService.get<string>('DOCUSIGN_ACCOUNT_ID'),
    //   envelopeIds: null
    // }

  }
}
