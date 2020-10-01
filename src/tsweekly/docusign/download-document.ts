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
const docusign = require('docusign-esign');

// noinspection UnnecessaryLocalVariableJS
export const downloadDocument = exports;

downloadDocument.worker = async (args) => {

  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);

  const envelopesApi = new docusign.EnvelopesApi(dsApiClient)

  const results = await envelopesApi.getDocument(
    args.accountId, args.envelopeId, args.documentId, null);


  const docItem = args.envelopeDocuments.find(item => item.documentId === args.documentId);
  let docName = docItem.name;
  const hasPDFsuffix = docName.substr(docName.length - 4).toUpperCase() === '.PDF';
  let pdfFile = hasPDFsuffix;

  if ((docItem.type === "content" || docItem.type === "summary") && !hasPDFsuffix){

    docName += ".pdf";
    pdfFile = true;
  }

  if (docItem.type === "zip") {
    docName += ".zip"
  }

  let mimetype;

  if (pdfFile) {
    mimetype = 'application/pdf'
  } else if (docItem.type === 'zip') {
    mimetype = 'application/zip'
  } else {
    mimetype = 'application/octet-stream'
  }
  return ({mimeType: mimetype, docName: docName, fileBytes: results});
}