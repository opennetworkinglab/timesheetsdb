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

import { readFileSync, writeFile } from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {google} = require('googleapis');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readline = require('readline');

export const gDriveAuth = exports;

gDriveAuth.authorize = (credentials) => {

  const TOKEN_PATH = 'token.json';

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  const token = readFileSync(TOKEN_PATH);

  oAuth2Client.setCredentials(JSON.parse(token.toString('utf8')));

  return oAuth2Client;

}

gDriveAuth.getAccessToken = (oAuth2Client) => {

  const SCOPES = ['https://www.googleapis.com/auth/drive'];

  const TOKEN_PATH = 'token.json';

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
}