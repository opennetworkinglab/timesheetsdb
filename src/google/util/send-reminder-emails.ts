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
import { Weekly } from '../../weekly/weekly.entity';
import { readFile } from 'fs';
import { promisify } from 'util';
import { Week } from '../../week/week.entity';
import { sendEmail } from '../gmail/send-email';

export const sendReminderEmails = exports;

sendReminderEmails.worker = async (auth) => {

  const usersSigned = await getConnection().getRepository(Weekly).find({ where: { userSigned: null }});

  const readFileAsync = promisify(readFile);

  const readEmailTemplates = await readFileAsync('./././templates/reminder-emails.json', 'utf8');

  const userTemplates = JSON.parse(readEmailTemplates).userEmails;

  // user emails
  while (usersSigned.length >= 1){

    const weekly = usersSigned.pop();

    const randomTemplate = userTemplates[Math.round(Math.random() * (userTemplates.length - 1))];

    let message = randomTemplate.message;

    // insert week dates in message
    if(randomTemplate.insertDates){

      const week = await getConnection().getRepository(Week).findOne({ where: { id: weekly.weekId }});

      const messageArr = message.split('_S_');
      message = "";

      for(let i = 0; i < messageArr.length; i++){

        if(messageArr[i] == 'INSERT_DATES'){

          if(i !== 0) message += " ";
          message += week.begin + " to " + week.end
          if(i !== messageArr.length - 1) message += " ";
        }
        else {
          message += messageArr[i];
        }
      }
    }

    const args = {
      userEmail: weekly.user.email,
      subject: randomTemplate.subject,
      message: message
    }

    await sendEmail.worker(auth, args);
  }

  //TODO: SUPERVISOR REMINDER EMAIL
}