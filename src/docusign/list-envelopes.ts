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

export const listEnvelopes = exports;
let lastQueryDate = new Date();

listEnvelopes.worker = async (args) => {

  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);

  const envelopesApi = new docusign.EnvelopesApi(dsApiClient)

  const options = { fromDate: lastQueryDate,fromToStatus: 'Completed' };
  lastQueryDate = new Date()

  return await envelopesApi.listStatusChanges(args.accountId, options);
}