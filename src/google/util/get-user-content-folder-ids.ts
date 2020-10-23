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

import { gDriveFolder } from '../gdrive/folder';

/**
 *
 * @param auth Google auth
 * @param args .searchTerm = ['FolderName1', ..., 'FolderNameN ] (Folder structure N - ... - 1) .parent = main folder parent
 * @param startCheckValue Should be the length of searchTerm - 1
 */
export const getUserContentFolderIds = async (auth, args, startCheckValue) => { // user - week - month - year

  let searchTerm;
  let fileMetadata;

  // search for user folder
  if (startCheckValue === 0) {

    searchTerm = "name='" + args.searchTerm[startCheckValue] + "' and parents in '" + args.parent + "' and trashed = false";

    let userFolder = await gDriveFolder.find(auth, searchTerm);

    if (userFolder.data.files.length > 0) {

      searchTerm = "name='images' and parents in '" + userFolder.data.files[0].id + "' and trashed = false";
      const imagesFolder = await gDriveFolder.find(auth, searchTerm);

      searchTerm = "name='unsigned' and parents in '" + userFolder.data.files[0].id + "' and trashed = false";
      const trashFolder = await gDriveFolder.find(auth, searchTerm);

      return {
        userFolder: userFolder.data.files[0].id,
        imagesFolder: imagesFolder.data.files[0].id,
        unsigned: trashFolder.data.files[0].id
      }
    }

    fileMetadata = {
      'name': args.userName,
      'mimeType': 'application/vnd.google-apps.folder',
      parents: [args.parent]
    };

    userFolder = await gDriveFolder.gDriveFolder.create(auth, fileMetadata);

    fileMetadata = {
      'name': 'images',
      'mimeType': 'application/vnd.google-apps.folder',
      parents: [userFolder.data.id]
    };

    const imagesFolder = await gDriveFolder.gDriveFolder.create(auth, fileMetadata);

    fileMetadata = {
      'name': 'unsigned',
      'mimeType': 'application/vnd.google-apps.folder',
      parents: [userFolder.data.id]
    };

    const trashFolder = await gDriveFolder.gDriveFolder.create(auth, fileMetadata);

    return {
      userFolder: userFolder.data.id,
      imagesFolder: imagesFolder.data.id,
      unsigned: trashFolder
    }
  }

  // checking for folder with parent
  searchTerm = "name='" + args.searchTerm[startCheckValue] + "' and parents in '" + args.parent + "' and trashed = false";

  const result = await gDriveFolder.find(auth, searchTerm);

  // Folder exists
  if (result.data.files.length > 0) {

    args.parent = result.data.files[0].id;

    return await this.getUserContentFolderIds(auth, args, startCheckValue - 1);

  } else {

    fileMetadata = {
      'name': args.searchTerm[startCheckValue],
      'mimeType': 'application/vnd.google-apps.folder',
      parents: [args.parent]
    };

    const folder = await gDriveFolder.create(auth, fileMetadata);
    args.parent = folder.data.id;

    return this.getUserContentFolderIds(auth, args, startCheckValue - 1);
  }
}