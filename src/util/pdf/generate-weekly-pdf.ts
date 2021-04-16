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

import { writeFileSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const buildPaths = {
  buildPathHtml: path.resolve('./build.html'),
  buildPathPdf: path.resolve('./build.pdf')
};

/**
 *
 * @param month int between 0 - 11
 * @param weeks 2d array of start and end date of each week in the month
 * @param pdfContents Name of user and total hours
 */
// TODO: Pass in user
export const generateWeeklyPdf = async (args) => {

  let htmlDoc = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8"><title></title>
      </head>

      <body style="font-family:sans-serif;">

        <h2 style="font-family: 'Trebuchet MS', Helvetica, sans-serif; color: darkblue;">${args.submitterName}, ${args.submitterEmail}</h2>
        
        <p style="font-family: 'Trebuchet MS', Helvetica, sans-serif; color: darkblue;">DARPA allocation: ${args.submitterDarpaAllocation}%</p>
        
        <p>Week: ${args.week.begin} - ${args.week.end}</p>
  
        <p style="margin-top:0;">Approver: ${args.supervisorName}, ${args.supervisorEmail}</p>
  
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
            </tr>`

  const timeName = args.days.timeName;
  const timeMinutes = args.days.timeMinutes

  let index = 0;
  while (index < timeMinutes[0].length){

    let name: string = timeName[0][index];

    if(name.includes('_') === true){
      name = name.replace('_', '&')
    }

    htmlDoc += `<tr><td style="padding: 9px 8px 0;border-bottom: 1px solid #667;">${name}</td>`

    for(let i = 0; i < timeMinutes.length; i++) {

      if(i % 2 === 0) {
        htmlDoc += `<td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${timeMinutes[i][index]}
                    <span style="color:white;"></span>
                  </td>`
      }
      else {

        // Check to see if total of darpa hours
        if(i == timeMinutes.length - 1 && index == 0){
          htmlDoc += `<td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;"><b>${timeMinutes[i][index]}</b></td>`
        }
        else {
          htmlDoc += `<td style="text-align: center; padding: 9px 8px 0;border-bottom: 1px solid #667;">${timeMinutes[i][index]}</td>`
        }
      }
    }
    htmlDoc += `</tr>`
    index++;
  }

  htmlDoc += `</tbody>
                  </table>
                  
                    <p style="margin-top:4em;">Submitted by: ${args.submitterName}, ${args.submitterEmail}</p>
                    <p style="margin-top:1em;">Submitted on: ${args.userSignedDate}</p>
                    <p style="margin-top:2em;">Approved by: ${args.supervisorName}, ${args.supervisorEmail}</p>
                    <p style="margin-top: 1em;">Approved on: ${args.supervisorSignedDate}</p>
                    </body>
              </html>`

  writeFileSync(buildPaths.buildPathHtml, htmlDoc)
  return await init()
}

const printPdf = async () => {
  /** Launch a headleass browser */
  const browser = await puppeteer.launch();
  /* 1- Create a newPage() object. It is created in default browser context. */
  const page = await browser.newPage();
  /* 2- Will open our generated `.html` file in the new Page instance. */

  await page.goto('file://' + buildPaths.buildPathHtml, { waitUntil: 'networkidle0' });
  /* 3- Take a snapshot of the PDF */
  const pdf = await page.pdf({
    width: '215.9mm',
    height: '279.4mm',
    margin: {
      top: '1in',
      right: '1in',
      bottom: '1in',
      left: '1in'
    }
  });
  /* 4- Cleanup: close browser. */
  await browser.close();
  return pdf;
};

const init = async () => {
  try {
    const pdf = await printPdf();
    writeFileSync(buildPaths.buildPathPdf, pdf);
    return pdf;
  } catch (error) {
    console.log('Error generating PDF', error);
  }
};
