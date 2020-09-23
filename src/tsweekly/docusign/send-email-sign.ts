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
import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const docusign = require('docusign-esign');

export const signingViaEmail = exports;

signingViaEmail.controller = async (token: string, signerEmail: string, signerName: string, ccEmail: string, ccName: string) => {

  // Call the worker method
  const envelopeArgs = {
      signerEmail: signerEmail,
      signerName: signerName,
      ccEmail: ccEmail,
      ccName: ccName,
      status: "sent"
    },
    args = {
      accessToken: token,
      basePath: basePath,
      accountId: accountId,
      envelopeArgs: envelopeArgs
    }
  let results = null;

  try {
    results = await signingViaEmail.worker(args)
    console.log(results);

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
  // document 1 (html) has tag **signature_1**
  // document 2 (docx) has tag /sn1/
  // document 3 (pdf) has tag /sn1/
  //
  // The envelope has two recipients.
  // recipient 1 - signer
  // recipient 2 - cc
  // The envelope will be sent first to the signer.
  // After it is signed, a copy is sent to the cc person.


  // read files from a local directory
  // The reads could raise an exception if the file is not available!
  const doc3PdfBytes = fs.readFileSync('ss.pdf');

  // Create the envelope definition
  const env = new docusign.EnvelopeDefinition();
  env.emailSubject = 'Please sign this document set';

  // add the documents
  const doc1 = new docusign.Document(),
    doc1b64 = Buffer.from(document1(args)).toString('base64'),
    doc3b64 = Buffer.from(doc3PdfBytes).toString('base64');

  doc1.documentBase64 = doc1b64;
  doc1.name = 'Order acknowledgement'; // can be different from actual file name
  doc1.fileExtension = 'html'; // Source data format. Signed docs are always pdf.
  doc1.documentId = '1'; // a label used to reference the doc

  const doc3 = new docusign.Document.constructFromObject({
    documentBase64: doc3b64,
    name: 'Lorem Ipsum', // can be different from actual file name
    fileExtension: 'pdf',
    documentId: '3'});

  // The order in the docs array determines the order in the envelope
  env.documents = [doc1, doc3];

  // create a signer recipient to sign the document, identified by name and email
  // We're setting the parameters via the object constructor
  const signer1 = docusign.Signer.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
    recipientId: '1',
    routingOrder: '1'});
  // routingOrder (lower means earlier) determines the order of deliveries
  // to the recipients. Parallel routing order is supported by using the
  // same integer as the order for two or more recipients.

  // create a cc recipient to receive a copy of the documents, identified by name and email
  // We're setting the parameters via setters
  const cc1 = new docusign.CarbonCopy();
  cc1.email = args.ccEmail;
  cc1.name = args.ccName;
  cc1.routingOrder = '2';
  cc1.recipientId = '2';

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
      anchorXOffset: '20'}),
    signHere2 = docusign.SignHere.constructFromObject({
      anchorString: '/sn1/',
      anchorYOffset: '10', anchorUnits: 'pixels',
      anchorXOffset: '20'})
  ;

  // Tabs are set per recipient / signer
  const signer1Tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere1, signHere2]});
  signer1.tabs = signer1Tabs;

  // Add the recipients to the envelope object
  const recipients = docusign.Recipients.constructFromObject({
    signers: [signer1],
    carbonCopies: [cc1]});
  env.recipients = recipients;

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  env.status = args.status;

  return env;
}

/**
 * Creates document 1
 * @function
 * @private
 * @param {Object} args parameters for the envelope:
 *   <tt>signerEmail</tt>, <tt>signerName</tt>, <tt>ccEmail</tt>, <tt>ccName</tt>
 * @returns {string} A document in HTML format
 */

function document1(args) {
  return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
          <meta charset="UTF-8"><title></title>
        </head>
        <body style="font-family:sans-serif;margin-left:2em;">
        <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
            color: darkblue;margin-bottom: 0;">World Wide Corp</h1>
        <h2 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
          margin-top: 0;margin-bottom: 3.5em;font-size: 1em;
          color: darkblue;">Order Processing Division - 2</h2>
        <h4>Ordered by ${args.signerName}</h4>
        <p style="margin-top:0; margin-bottom:0;">Email: ${args.signerEmail}</p>
        <p style="margin-top:0; margin-bottom:0;">Copy to: ${args.ccName}, ${args.ccEmail}</p>
        <table style="width:100%; font-family:sans-serif;text-align:center;border-spacing:2px;border-color:grey;line-height:1.5;" summary="timesheet">
        <thead style="vertical-align: middle;">
            <tr>
                <th scope="col" style="align-content: center;font-size:1.1em;border-bottom: 2px solid #6678b1;">Hours</th>
            </tr>
            <tr>
              <th scope="col" style="text-align: center; padding: 9px 20px 0;font-size:1.1em;border-bottom: 2px solid #6678b1;"></th>
              <th scope="col" style="padding: 9px 20px 0;font-size:1.1em;border-bottom: 2px solid #6678b1;">Mon</th>
              <th scope="col" style="padding: 9px 20px 0;font-size:1.1em;border-bottom: 2px solid #6678b1;">Tue</th>
              <th scope="col" style="padding: 9px 20px 0;font-size:1.1em;border-bottom: 2px solid #6678b1;">Wed</th>
              <th scope="col" style="padding: 9px 20px 0;font-size:1.1em;border-bottom: 2px solid #6678b1;">Thu</th>
              <th scope="col" style="padding: 9px 20px 0;font-size:1.1em;border-bottom: 2px solid #6678b1;">Fri</th>
              <th scope="col" style="padding: 9px 20px 0;font-size:1.1em;border-bottom: 2px solid #6678b1;">Sat</th>
              <th scope="col" style="padding: 9px 20px 0;font-size:1.1em;border-bottom: 2px solid #6678b1;">Sun</th>
              <th scope="col" style="padding: 9px 20px 0;font-size:1.1em;border-bottom: 2px solid #6678b1;">Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">Darpa HR001120C0107</td>
                <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">
                    <span style="color:white;">/l1q/</span>
                </td>
                <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">0.25</td>
                <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">
                    $<span style="color:white;">/l1e/</span>
                </td>
            </tr>
            <tr>
                <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">Non Darpa</td>
                <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">
                    <span style="color:white;">/l2q/</span>
                </td>
                <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">0.75</td>
                <td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">
                    $<span style="color:white;">/l2e/</span>
                </td>
            </tr>
<!--            <tr>-->
<!--                <td colspan="3" -->
<!--                    style="font-weight: bold;font-size:1.1em;text-align: right;padding: 9px 8px 0;border-bottom: 5px solid #667;">Total:</td>-->
<!--                <td style="font-weight: bold;font-size:1.1em;padding: 9px 8px 0;border-bottom: 5px solid #667;">-->
<!--                    $<span style="color:white;">/l3t/</span>-->
<!--                </td>-->
<!--            </tr>-->
        </tbody>
    </table>
        <p style="margin-top:3em;">
  Candy bonbon pastry jujubes lollipop wafer biscuit biscuit. Topping brownie sesame snaps sweet roll pie. Croissant danish biscuit soufflé caramels jujubes jelly. Dragée danish caramels lemon drops dragée. Gummi bears cupcake biscuit tiramisu sugar plum pastry. Dragée gummies applicake pudding liquorice. Donut jujubes oat cake jelly-o. Dessert bear claw chocolate cake gummies lollipop sugar plum ice cream gummies cheesecake.
        </p>
        <!-- Note the anchor tag for the signature field is in white. -->
        <h3 style="margin-top:3em;">Agreed: <span style="color:white;">**signature_1**/</span></h3>
        <h3 style="margin-top: 3em; margin-right: 30em;">Agreed: <span style="color:white;">**signature_2**/</span></h3>
        </body>
    </html>
  `
}