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
import { Week } from '../../week/week.entity';
import { formatArrayYYMMDD } from '../../util/date/date-formating';
import { moveFile } from '../gdrive/move-file';
import { auth } from '../auth';
import { getUserContentFolderIds } from './get-user-content-folder-ids';

/**
 *
 * @param auth
 * @param user
 * @param args .weekID .FileId .googleCredentials
 */
export const moveDocumentToUnsigned = async (args) => {

  const week = await getConnection().getRepository(Week).findOne({ where: { id: args.weekId }});

  const oAuth2Client = await auth.authorize(args.googleCredentials);

  let weekStart = formatArrayYYMMDD(week.begin);
  const weekEnd = formatArrayYYMMDD(week.end);

  weekStart = weekStart[1] + "-" + weekStart[2]
  const month = weekEnd[1];
  const year = weekEnd[0];

  const userFolderArgs = {
    searchTerm: [weekStart, month, year],
    parent: args.googleParent
  }

  const userFolder = await getUserContentFolderIds(oAuth2Client, userFolderArgs, userFolderArgs.searchTerm.length - 1);

  const fileMoveArgs = {
    fileId: args.fileId,
    folderId: userFolder.unsigned
  }

  return await moveFile.worker(oAuth2Client, fileMoveArgs);
}
