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

import { getConnection } from 'typeorm';
import { Week } from '../../../week/week.entity';
import { Day } from '../../../day/day.entity';
import { User } from '../../../auth/user.entity';
import { timesTo2DArray7Days } from '../../../util/array/to-array';
import { signingViaEmail } from '../../send-email-sign';
import { listEnvelopeDocuments } from '../../list-envelope-documents';
import { downloadDocument } from '../../download-document';
import { fromBuffer } from 'pdf2pic';
import { createReadStream } from "fs";
import { auth } from '../../../google/auth';
import { formatArrayYYMMDD } from '../../../util/date/date-formating';
import { tmpdir } from 'os';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getUserContentFolderIds } from '../../../google/util/get-user-content-folder-ids';
import { upload } from '../../../google/gdrive/upload';
import { recipientView } from '../../recipient-view-request';
import { generateWeeklyPdf } from '../../../util/pdf/generate-weekly-pdf';
import { Weekly } from '../../../weekly/weekly.entity';
import { Project } from '../../../project/project.entity';

/**
 * Generates an envelope and preview and uploads preview to google drive.
 * @param user
 * @param weekId
 * @param authArgs
 * @param googleParent
 * @return object containing generation link and envelope id.
 */
export const generateEnvelopeAndPreview = async (user, weekId, authArgs, googleParent, redirectUrl) => {

  const week = await getConnection().getRepository(Week).findOne({ where: { id: weekId } });
  const days = await getConnection().getRepository(Day).find({
    where: { user: user, weekId: weekId },
    order: { day: 'ASC' }
  });
  const supervisor = await getConnection().getRepository(User).findOne({ where: { email: user.supervisorEmail } });

  if (days.length === 0) {
    throw new HttpException("No times have been logged for any days this week", HttpStatus.BAD_REQUEST);
  }

  const daysResult = await timesTo2DArray7Days(user, days);

  const userSignedDate = new Date();

  const submitterTimeString = userSignedDate.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short'
  })
    .replace(' AM', 'am')
    .replace(' PM', 'pm');

  const splitBeginDate = formatArrayYYMMDD(week.begin);
  const splitEndDate = formatArrayYYMMDD(week.end);

  const weekString = {
    begin: splitBeginDate[1] + '/' + splitBeginDate[2] + '/' + splitBeginDate[0],
    end: splitEndDate[1] + '/' + splitEndDate[2] + '/' + splitEndDate[0]
  };

  // args for document generation. The document to be signed. Html args are for the html that is used to create the document
  const htmlArgs = {
      submitterEmail: user.email,
      submitterName: user.firstName + " " + user.lastName,
      submitterDarpaAllocation: user.darpaAllocationPct,
      supervisorEmail: supervisor.email,
      supervisorName: supervisor.firstName + " " + supervisor.lastName,
      days: daysResult,
      week: weekString,
      userSignedDate: submitterTimeString,
      supervisorSignedDate: '',
    },
    signEmailArgs = {
      documentName: user.firstName + "_" + user.lastName + "_" + week.begin + "_" + week.end,
      basePath: authArgs.docusignBasePath,
      accountId: authArgs.docusignAccountId,
      accessToken: authArgs.docusignToken,
      htmlArgs: htmlArgs,
    };

  const envelope = await signingViaEmail.controller(signEmailArgs);

  const signed = envelope.envelopeId;

  const embeddedArgs = {
    dsReturnUrl: redirectUrl,
    signerEmail: user.email,
    signerName: user.firstName + " " + user.lastName,
    signerClientId: 1,
    basePath: authArgs.docusignBasePath,
    accountId: authArgs.docusignAccountId,
    accessToken: authArgs.docusignToken,
    envelopeId: signed,
  }

  const viewRequest = await recipientView.controller(embeddedArgs)

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
  const result = await image(1);

  const oAuth2Client = await auth.authorize(authArgs.googleCredentials);

  const weekStart = formatArrayYYMMDD(week.begin);
  const weekEnd = formatArrayYYMMDD(week.end);

  const weekFolderDate = weekStart[1] + '-' + weekStart[2] + ' to ' + weekEnd[1] + '-' + weekEnd[2];
  const month = weekEnd[1];
  const year = weekEnd[0];

  const args = {
    searchTerm: [weekFolderDate, month, year],
    parent: googleParent
  }

  const results = await getUserContentFolderIds(oAuth2Client, args, args.searchTerm.length - 1);

  let imageName = result.name.split('.');
  imageName = imageName[0] + "." + imageName[2];

  const gDriveArgs = {

    name: imageName,
    parents: [results.imagesFolder],
    mimeType: 'image/png',
    body: createReadStream(tempDir + '/' + result.name)
  }

  const file = await upload.worker(oAuth2Client, gDriveArgs);

  const url = authArgs.googleShareUrl;
  const urlSplit = url.split('IDLOCATION');
  const preview = urlSplit[0] + file.data.id;

  return {
    preview: preview,
    signed: signed,
    signedDate: userSignedDate,
    viewRequest: viewRequest
  }
}

export const generatePdf = async (submitterUser, approverUser, weekId, weekly: Weekly, authArgs, googleParent) => {

  const week = await getConnection().getRepository(Week).findOne({ where: { id: weekId } });
  const days = await getConnection().getRepository(Day).find({
    where: { user: submitterUser, weekId: weekId },
    order: { day: 'ASC' }
  });

  if(days.length === 0) {
    throw new HttpException("No times have been logged for any days this week", HttpStatus.BAD_REQUEST);
  }

  // SORT PROJECTS FOR EACH DAY
  const projects = await getConnection().getRepository(Project).find({
    order: {
      priority: 'ASC'
    }
  });

  for (let i = 0; i < days.length; i++){

    days[i].times.sort((a, b) => {

      const project1 = projects.find(project=> project.name === a.name);
      const project2 = projects.find(project=> project.name === b.name);

      if (project1.priority > project2.priority){
        return 1;
      }
      else {
        return -1;
      }
    });

  }

  const daysResult = await timesTo2DArray7Days(submitterUser, days);

  const signedDate = new Date();

  const timeString = signedDate.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short'
  })
    .replace(' AM', 'am')
    .replace(' PM', 'pm');

  const splitBeginDate = formatArrayYYMMDD(week.begin);
  const splitEndDate = formatArrayYYMMDD(week.end);

  const weekString = {
    begin: splitBeginDate[1] + '/' + splitBeginDate[2] + '/' + splitBeginDate[0],
    end: splitEndDate[1] + '/' + splitEndDate[2] + '/' + splitEndDate[0]
  };

  let htmlArgs;

  if(weekly){

    const userSignedDate = new Date(weekly.userSignedDate);
    const userTimeString = userSignedDate.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      timeZoneName: 'short'
    })
      .replace(' AM', 'am')
      .replace(' PM', 'pm');

    htmlArgs = {
      submitterEmail: submitterUser.email,
      submitterName: submitterUser.firstName + " " + submitterUser.lastName,
      submitterDarpaAllocation: submitterUser.darpaAllocationPct,
      supervisorEmail: approverUser.email,
      supervisorName: approverUser.firstName + " " + approverUser.lastName,
      days: daysResult,
      week: weekString,
      userSignedDate: userTimeString,
      supervisorSignedDate: timeString,
    }
  }
  else{

    htmlArgs = {
      submitterEmail: submitterUser.email,
      submitterName: submitterUser.firstName + " " + submitterUser.lastName,
      submitterDarpaAllocation: submitterUser.darpaAllocationPct,
      supervisorEmail: "", //approverUser.email,
      supervisorName: "", //approverUser.firstName + " " + approverUser.lastName,
      days: daysResult,
      week: weekString,
      userSignedDate: timeString,
      supervisorSignedDate: '',
    }

  }

  const pdf = await generateWeeklyPdf(htmlArgs)
  const saveName = submitterUser.firstName + '_' + submitterUser.lastName + '_' + week.begin + '_' + week.end

  const tempDir = tmpdir();
  const image = fromBuffer(Buffer.from(pdf, 'binary'), {
    density: 100,
    format: "png",
    width: 600,
    height: 600,
    quality: 100,
    saveFilename: saveName,
    savePath: tempDir
  });
  const result = await image(1);

  const oAuth2Client = await auth.authorize(authArgs.googleCredentials);

  const weekStart = formatArrayYYMMDD(week.begin);
  const weekEnd = formatArrayYYMMDD(week.end);

  const weekFolderDate = weekStart[1] + '-' + weekStart[2]  + ' to ' + weekEnd[1] + '-' + weekEnd[2];
  const month = weekEnd[1];
  const year = weekEnd[0];

  const args = {
    searchTerm: [weekFolderDate, month, year],
    parent: googleParent
  }

  const results = await getUserContentFolderIds(oAuth2Client, args, args.searchTerm.length - 1);

  let imageName = result.name.split('.');
  imageName = imageName[0] + "." + imageName[2];

  const gDriveArgs = {

    name: imageName,
    parents: [results.imagesFolder],
    mimeType: 'image/png',
    body: createReadStream(tempDir + '/' + result.name)
  }

  const file = await upload.worker(oAuth2Client, gDriveArgs);

  const url = authArgs.googleShareUrl;
  const urlSplit = url.split('IDLOCATION');
  const preview = urlSplit[0] + file.data.id;

  return {
    pdf: pdf,
    preview: preview,
    signedDate: signedDate,
  }
}

