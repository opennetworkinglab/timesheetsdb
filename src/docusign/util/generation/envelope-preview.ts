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
import { dayEntityTimesTo2DArray } from '../../../util/array/to-array';
import { signingViaEmail } from '../../send-email-sign';
import { listEnvelopeDocuments } from '../../list-envelope-documents';
import { downloadDocument } from '../../download-document';
import { fromBuffer } from 'pdf2pic';
import { createReadStream } from "fs";
import { auth } from '../../../gdrive/auth';
import { upload } from '../../../gdrive/upload';
import { formatArrayYYMMDD } from '../../../util/date/date-formating';
import { tmpdir } from 'os';
import { getUserContentFolderIds } from '../../../gdrive/util/get-user-content-folder-ids';

/**
 * Generates an envelope and preview and uploads preview to google drive.
 * @param user
 * @param weekId
 * @param authArgs
 * @param googleParent
 * @return object containing generation link and envelope id.
 */
export const generateEnvelopeAndPreview = async (user, weekId, authArgs, googleParent) => {

  const week = await getConnection().getRepository(Week).findOne({ where: { id: weekId }});
  const days = await getConnection().getRepository(Day).find({ where: { user: user, weekId: weekId }});
  const admin = await getConnection().getRepository(User).findOne({ where: { email: user.supervisorEmail }});

  const daysResult = dayEntityTimesTo2DArray(user, days);

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

  const signed = envelope.envelopeId;

  const retrieveDocArgs = {
    basePath: authArgs.docusignBasePath,
    accountId: authArgs.docusignAccountId,
    accessToken: authArgs.docusignToken,
    envelopeId: signed,
    documentId: null,
    envelopeDocuments: null
  }

  const documents = await listEnvelopeDocuments.worker(retrieveDocArgs);

  // TODO: Go throw documents and create generation.

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

  let weekStart = formatArrayYYMMDD(week.begin);
  const weekEnd = formatArrayYYMMDD(week.end);

  weekStart = weekStart[1] + "-" + weekStart[2]
  const month = weekEnd[1];
  const year = weekEnd[0];

  const args = {
    searchTerm: [user.firstName + " " + user.lastName, weekStart, month, year],
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

  const file  = await upload.worker(oAuth2Client, gDriveArgs);

  const url  = authArgs.googleShareUrl;
  const urlSplit = url.split('id');
  const preview = urlSplit[0] + file.data.id + urlSplit[1];

  return {
    preview: preview,
    signed: signed
  }
}