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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {google} = require('googleapis');

export const gDriveFolder = exports;

const pageToken = null;

gDriveFolder.find = async (auth, searchTerms) => {

  const drive = google.drive({ version: 'v3', auth: auth });

  // noinspection TypeScriptValidateJSTypes
  return await drive.files.list({
    q: searchTerms,
    fields: 'nextPageToken, files(id, name)',
    spaces: 'drive',
    pageToken: pageToken
  });
}

gDriveFolder.create = async (auth, fileMetadata) => {

  const drive = google.drive({ version: 'v3', auth: auth });

  return await drive.files.create({
    resource: fileMetadata,
    fields: 'id'
  });
}
