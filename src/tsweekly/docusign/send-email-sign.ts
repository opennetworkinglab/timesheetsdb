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

import { accountId, basePath } from '../../config/docusign.config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const docusign = require('docusign-esign');

export const signingViaEmail = exports;

signingViaEmail.controller = async (token: string, args) => {

  // Call the worker method
  const envelopeArgs = {
      signerEmail: args.signerEmail,
      signerName: args.signerName,
      ccEmail: args.ccEmail,
      ccName: args.ccName,
      status: "sent",
      htmlArgs: args.htmlArgs
    },
    workerArgs = {
      accessToken: token,
      basePath: basePath,
      accountId: accountId,
      envelopeArgs: envelopeArgs,
    }

  try {
    return await signingViaEmail.worker(workerArgs)


  } catch (error) {
    console.log(error);
  }
}

signingViaEmail.worker = async (args) => {

  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);

  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  const envelopesApi = new docusign.EnvelopesApi(dsApiClient)

  const envelope = makeEnvelope(args.envelopeArgs)

  const results = await envelopesApi.createEnvelope(
    args.accountId, {
      envelopeDefinition: envelope
    });
  const envelopeId = results.envelopeId;

  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
  return ({ envelopeId: envelopeId })
}

function makeEnvelope(args){

  // The envelope has two recipients.
  // recipient 1 - signer
  // recipient 2 - cc
  // The envelope will be sent first to the signer.
  // After it is signed, a copy is sent to the cc person.

  // Create the envelope definition
  const env = new docusign.EnvelopeDefinition();
  env.emailSubject = 'Please sign this document set';

  // add the documents
  const doc1 = new docusign.Document();

  doc1.documentBase64 = Buffer.from(htmlPage(args.htmlArgs)).toString('base64');
  doc1.name = 'Time sheet acknowledgement';
  doc1.fileExtension = 'html';
  doc1.documentId = '1';

  env.documents = [doc1];

  // create a signer recipient to sign the document, identified by name and email
  // We're setting the parameters via the object constructor
  const signer1 = docusign.Signer.constructFromObject({
    email: args.htmlArgs.submitterEmail,
    name: args.htmlArgs.submitterName,
    recipientId: '1',
    routingOrder: '1'});

  const signer2 = docusign.Signer.constructFromObject({
    email: args.htmlArgs.supervisorEmail,
    name: args.htmlArgs.supervisorName,
    recipientId: '2',
    routingOrder: '2'});
  // routingOrder (lower means earlier) determines the order of deliveries
  // to the recipients. Parallel routing order is supported by using the
  // same integer as the order for two or more recipients.

  // Create signHere fields (also known as tabs) on the documents,
  // We're using anchor (autoPlace) positioning
  //
  // The DocuSign platform searches throughout your envelope's
  // documents for matching anchor strings. So the
  // signHere2 tab will be used in both document 2 and 3 since they
  // use the same anchor string for their "signer 1" tabs.
  const signHere1 = docusign.SignHere.constructFromObject({
    anchorString: '**signature_1**',
    anchorYOffset: '10', anchorUnits: 'pixels',
    anchorXOffset: '20'});

  const signHere2 = docusign.SignHere.constructFromObject({
    anchorString: '**signature_2**',
    anchorYOffset: '10', anchorUnits: 'pixels',
    anchorXOffset: '20'});

  // Tabs are set per recipient / signer
  signer1.tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere1]});

  signer2.tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere2]});

  // Add the recipients to the envelope object
  // Second signer will receive email to sign after the first one has signed
  env.recipients = docusign.Recipients.constructFromObject({
    signers: [signer1, signer2],
  });

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  env.status = args.status;

  return env;
}

/**
 * Creates html document
 * @function
 * @private
 * @param {Object} args parameters for the envelope:
 *   <tt>signerEmail</tt>, <tt>signerName</tt>, <tt>ccEmail</tt>, <tt>ccName</tt>
 * @returns {string} A document in HTML format
 */

function htmlPage(args) {

  return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
          <meta charset="UTF-8"><title></title>
        </head>
        
        <body style="font-family:sans-serif;margin-left:2em;">
        <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
            color: darkblue;margin-bottom: 0;">${args.signerName}: ${args.signerEmail}</h1>
        <h2 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
          margin-top: 0;margin-bottom: 3.5em;font-size: 1em;
          color: darkblue;">Timesheet Week no: ${args.week.weekNo}</h2>
        <h4>Week: ${args.week.begin} - ${args.week.end}</h4>
        <p style="margin-top:0; margin-bottom:0;">Email: ${args.signerEmail}</p>
        <p style="margin-top:0; margin-bottom:0;">Copy to: ${args.ccName}, ${args.ccEmail}</p>
        
        <table style="width: 100%; font-family:sans-serif;text-align: center;border-spacing:2px;border-color:grey;line-height:1.5;">
        
        <thead style="vertical-align: middle;">
            <tr>
              <th scope="col" colspan="9" style="padding: 9px 20px 0;font-size:1.1em;border-bottom: 2px solid #6678b1;">Hours</th>
            </tr>
        </thead>
        
        <tbody>
            <tr>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;"></td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">Mon
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">Tue</td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">Wed
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">Thu</td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">Fri
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">Sat</td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">Sun
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">Total</td>
            </tr>
            
            <tr>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">Darpa HR001120C0107</td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[0][0]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[1][0]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[2][0]}
                  <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[3][0]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[4][0]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[5][0]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[6][0]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[7][0]}
              </td>
            </tr>
            
            <tr>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">Non Darpa</td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[0][1]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[1][1]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[2][1]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[3][1]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[4][1]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[5][1]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[6][1]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[7][0]}
              </td>
            </tr>
            
            <tr>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">Sick</td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[0][2]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[1][2]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[2][2]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[3][2]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[4][2]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[5][2]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[6][2]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[7][2]}
              </td>
            </tr>
            
            <tr>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">PTO</td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[0][3]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[1][3]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[2][3]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[3][3]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[4][3]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[5][3]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[6][3]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[7][3]}
              </td>
            </tr>
            
            <tr>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">Holiday</td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[0][4]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[1][4]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[2][4]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[3][4]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[4][4]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[5][4]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[6][4]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[7][4]}
              </td>
            </tr>
            
            <tr>
              <td style="padding: 9px 8px 0; border-bottom: 2px solid #6678b1;">Total</td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #6678b1;">${args.hours[7][0]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[7][1]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #6678b1;">${args.hours[7][2]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[7][3]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #6678b1;">${args.hours[7][4]}
                <span style="color:white;"></span>
              </td>
              <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${args.hours[7][5]}
              </td>
              <td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #6678b1;">${args.hours[7][6]}
                <span style="color:white;"></span>
            </tr>
        </tbody>
    </table>
    
        <!-- Note the anchor tag for the signature field is in white. -->
        <h3 style="margin-top:3em;">Submitter: <span style="color:white;">**signature_1**</span></h3>
        <h3 style="margin-top: 6em;">Supervisor: <span style="color:white;">**signature_2**</span></h3>
        </body>
    </html>
  `
}