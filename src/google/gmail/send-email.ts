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

export const sendEmail = exports;

/**
 *
 * @param auth
 * @param args .userEmail .message .subject
 */
sendEmail.worker = async (auth, args) => {

  const gmail = google.gmail({ version: 'v1', auth: auth});

  const makeBody = params => {

    params.subject = Buffer.from(params.subject).toString("base64");
    const str = [
      'Content-Type: text/html; charset="UTF-8"\n',
      "MINE-Version: 1.0\n",
      "Content-Transfer-Encoding: base64\n",
      `to: ${params.to} \n`,
      `from: ${params.from} \n`,
      `subject: =?UTF-8?B?${params.subject}?= \n\n`,
      params.message
    ].join(""); // <--- Modified
    return Buffer.from(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const raw = makeBody({
    to: args.userEmail,
    subject: args.subject,
    message: args.message
  });

  return await gmail.users.messages.send({
    userId: 'me', // TODO: LOOK AT USERID
    resource: {
      raw: raw
    }
  });
}
