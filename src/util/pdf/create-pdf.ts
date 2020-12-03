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

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import { writeFile } from 'fs.promises';

export class PdfContent {

  name: string;
  data: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 *
 * @param month int between 0 - 11
 * @param weeks 2d array of start and end date of each week in the month
 * @param pdfContents Name of user and total hours
 */
export const createPdf = async (month: number, weeks : string[][], pdfContents: PdfContent[]) => {

  const xValue1 = 50;
  const xValue2 = 250;
  const headingFont = 18;
  const paraFont = 15;
  const firstHeightDrop = 4;
  let secondHeightDrop = 11;

  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  page.drawText('Weeks for Month: ' + MONTHS[month], {
    x: xValue1,
    y: height - firstHeightDrop * headingFont,
    size: headingFont,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  let j = 1;
  for (let i = 0; i < weeks.length; i += 2) {

    page.drawText(weeks[i][0] + ' to ' + weeks[i][1], {
      x: xValue1,
      y: height - firstHeightDrop * headingFont - (paraFont * (j * 1.5) + 10),
      size: paraFont,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    if (i + 1 < weeks.length) {
      page.drawText(weeks[i + 1][0] + ' to ' + weeks[i + 1][1], {
        x: xValue1 + 200,
        y: height - firstHeightDrop * headingFont - (paraFont * (j * 1.5) + 10),
        size: paraFont,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
    }
    j++;
  }

  page.drawText('Direct Labor', {
    x: xValue1,
    y: height - secondHeightDrop * headingFont,
    size: headingFont,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  page.drawText('Hours', {
    x: xValue2,
    y: height - secondHeightDrop * headingFont,
    size: headingFont,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  j = 1;
  for(let i = 0; i < pdfContents.length; i++){

    // If the pdfContents exceeds the page creates new page and continues
    if(height - secondHeightDrop * headingFont - (paraFont * (j * 1.5) + 10) <= 80){
      secondHeightDrop = 4;
      page = pdfDoc.addPage();
      j = 1;
    }

    page.drawText(pdfContents[i].name, {
      x: xValue1,
      y: height - secondHeightDrop * headingFont - (paraFont * (j * 1.5) + 10),
      size: paraFont,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(pdfContents[i].data, {
      x: xValue2,
      y: height - secondHeightDrop * headingFont - (paraFont * (j * 1.5) + 10),
      size: paraFont,
      font: timesRomanFont,
      color: rgb(0, 0, 0.),
    });
    j++;
  }

  // const pdfBytes = await pdfDoc.save();
  // await writeFile('out.pdf', pdfBytes);
  // writeFile('out.pdf', pdfBytes).then(()=>{
  //   console.log("dsasdad");
  // }).catch((err) => {
  //   console.log(err);
  // });

  return await pdfDoc.save();
}
