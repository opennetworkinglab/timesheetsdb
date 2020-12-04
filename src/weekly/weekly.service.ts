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
import { getConnection, In } from 'typeorm';
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
import { tmpdir } from 'os';
import { upload } from '../google/gdrive/upload';
import { getMonthFolderId, getUserContentFolderIds } from '../google/util/get-user-content-folder-ids';
import { Week } from '../week/week.entity';
import { formatArrayYYMMDD } from '../util/date/date-formating';
import { sendEmail } from '../google/gmail/send-email';
import { createPdf, PdfContent } from '../util/pdf/create-pdf';
import { Day } from '../day/day.entity';
import { readFile } from 'fs.promises';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectsToCsv = require('objects-to-csv')

class CsvFile {
  'Name': string;
  'Total Hours': string;
  'Month': number;
  'Week One': string;
  'Week Two': string;
  'Week Three': string;
  'Week Four': string;
  'Week Five': string;
}

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
      const weekly = await getConnection().getRepository(Weekly).findOne({ where: { userSigned: args.envelopeId } });

      // if envelope ids are gotten that are not created from this application they wont be in db
      if (weekly) {

        const week = await getConnection().getRepository(Week).findOne({ where: { id: weekly.weekId } });
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
        const userFolder = await getUserContentFolderIds(oAuth2Client, userFolderArgs, userFolderArgs.searchTerm.length - 1);

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
        gDriveArgs.body = createReadStream(tempDir + "/" + imResult.name);

        file = await upload.worker(oAuth2Client, gDriveArgs);

        // Get url to save to DB for preview png image
        url = this.configService.get<string>('GOOGLE_DOC_URL_TEMPLATE');
        urlSplit = url.split('IDLOCATION');
        const preview = urlSplit[0] + file.data.id;

        const result = await this.weeklyRepository.updateWeeklySupervisor(args.envelopeId, documentUrl, preview);

        updates += Number(result.affected);
      }
    }

    // I am a teapot!
    throw new HttpException(updates + ' updated', HttpStatus.I_AM_A_TEAPOT);
  }

  async summaryReport() {

    // Get current month
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const weeks = await getConnection().getRepository(Week).find({
      where: {
        monthNo: In([month, month - 1]),
      },
      order: {
        begin: 'ASC'
      }
    });

    // converting weeks array into weeks id array
    const queryWeekIds = [];
    const weeksInMonth = [];
    for (let i = 0; i < weeks.length; i++) {

      const queryMonth = new Date(weeks[i].end).getMonth() + 1;

      // check id end date falls in current month.
      if (queryMonth === month) {
        queryWeekIds.push(weeks[i].id);
        weeksInMonth.push([weeks[i].begin, weeks[i].end]);
      }
    }

    // Getting weeklies signed for current month.
    const weekliesSigned = await getConnection().getRepository(Weekly).find({
      where: {
        weekId: In(queryWeekIds),
        supervisorSigned: true,
      },
      order: {
        user: 'ASC',
      },
    });

    // combine all weekly ids into one array with user
    const weekliesUsers = [];
    let currentUser: User = undefined;
    let currentUserWeekIds = [];
    for (let i = 0; i < weekliesSigned.length; i++) {

      const user = weekliesSigned[i].user;

      if (currentUser === undefined) {

        currentUser = user;
        currentUserWeekIds.push(weekliesSigned[i].weekId);
      } else if (currentUser.email !== user.email) {

        weekliesUsers.push([currentUser, currentUserWeekIds]);

        currentUser = user;
        currentUserWeekIds = [];
        currentUserWeekIds.push(weekliesSigned[i].weekId);
      } else {
        currentUserWeekIds.push(weekliesSigned[i].weekId);

        if (i === weekliesSigned.length - 1) {
          weekliesUsers.push([currentUser, currentUserWeekIds]);
        }
      }
    }

    const pdfContents: PdfContent[] = [];
    let currentPdfContent: PdfContent = undefined;

    for (let i = 0; i < weekliesUsers.length; i++) {

      currentPdfContent = new PdfContent();
      currentPdfContent.name = weekliesUsers[i][0].firstName + ' ' + weekliesUsers[i][0].lastName;
      let totalTime = 0;

      const days = await getConnection().getRepository(Day).find({
        where: {
          weekId: In(weekliesUsers[i][1]),
          user: weekliesUsers[i][0]
        },
      });

      for (let j = 0; j < days.length; j++) {

        for(let k = 0; k < days[j].times.length; k++){

          totalTime += days[j].times[k].minutes;
        }
      }

      currentPdfContent.data = (totalTime / 60).toString();
      pdfContents.push(currentPdfContent);
    }

    const pdfBytes = await createPdf(month - 1, weeksInMonth, pdfContents);

    const googleCredentials = await this.getGoogleCredentials();
    const oAuth2Client = await auth.authorize(googleCredentials);

    const args = {
      searchTerm: [month, year],
      parent: this.configService.get<string>('GOOGLE_DOC_PARENT_FOLDER')
    }

    const gDriveMonthId = await getMonthFolderId(oAuth2Client, args, args.searchTerm.length - 1);

    let readableInstanceStream = new Readable({
      read() {
        this.push(pdfBytes);
        this.push(null);
      }
    });

    // Save document to drive
    const gDriveArgs = {
      name: 'Summary for ' + year + '-' + month,
      parents: [gDriveMonthId],
      mimeType: 'image/pdf',
      body: readableInstanceStream
    }

    await upload.worker(oAuth2Client, gDriveArgs);

    const csvContents = [];

    for(let i = 0; i < pdfContents.length; i++){

      const csvFile = new CsvFile();

      csvFile.Name = pdfContents[i].name;
      csvFile['Total Hours'] = pdfContents[i].data;
      csvFile.Month = month;

      if(i == 0) {
        csvFile['Week One'] = weeksInMonth[0][0] + ' to ' + weeksInMonth[0][1];
        csvFile['Week Two'] = weeksInMonth[1][0] + ' to ' + weeksInMonth[1][1];
        csvFile['Week Three'] = weeksInMonth[2][0] + ' to ' + weeksInMonth[2][1];

        if (weeksInMonth.length >= 4) {
          csvFile['Week Four'] = weeksInMonth[3][0] + ' to ' + weeksInMonth[3][1];
        }

        if (weeksInMonth.length >= 5) {
          csvFile['Week Five'] = weeksInMonth[4][0] + ' to ' + weeksInMonth[4][1];
        }
      }

      csvContents.push(csvFile);
    }

    const tempDir = tmpdir();
    const csv = new ObjectsToCsv(csvContents);
    await csv.toDisk(tempDir + '/Summary of Nov.csv');

    const readCsvFile = await readFile(tempDir + '/Summary of Nov.csv');
    readableInstanceStream = new Readable({
      read() {
        this.push(Buffer.from(readCsvFile, 'binary'));
        this.push(null);
      }
    });

    gDriveArgs.mimeType = 'text/csv';
    gDriveArgs.body = readableInstanceStream;
    await upload.worker(oAuth2Client, gDriveArgs);
  }

  async getGoogleCredentials() {

    const redirectUris = this.configService.get<string>('GOOGLE_REDIRECT_URIS').split(', ');

    return {
      'installed': {
        'client_id': this.configService.get<string>('GOOGLE_CLIENT_ID'),
        'project_id': this.configService.get<string>('GOOGLE_PROJECT_ID'),
        'auth_uri': this.configService.get<string>('GOOGLE_AUTH_URI'),
        'token_uri': this.configService.get<string>('GOOGLE_TOKEN_URI'),
        'auth_provider_x509_cert_url': this.configService.get<string>('GOOGLE_AUTH_PROVIDER_X509_CERT_URL'),
        'client_secret': this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        'redirect_uris': redirectUris,
      },
    };
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

    // TODO change to previous week. If sunday current and previous week.
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
}
