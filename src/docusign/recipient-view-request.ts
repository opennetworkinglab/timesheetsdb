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

export const recipientView = exports;

recipientView.controller = async (args) => {

  const viewRequest = new docusign.RecipientViewRequest();

  viewRequest.returnUrl = args.dsReturnUrl;
  viewRequest.authenticationMethod = 'none';
  viewRequest.email = args.signerEmail;
  viewRequest.userName = args.signerName;
  viewRequest.clientUserId = args.signerClientId;

  return await recipientView.worker(viewRequest, args);
}

recipientView.worker = async (viewRequest, args) =>{

  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);

  const envelopesApi = new docusign.EnvelopesApi(dsApiClient)

  const results = await envelopesApi.createRecipientView(args.accountId, args.envelopeId, {recipientViewRequest: viewRequest});
  return results.url;
}
