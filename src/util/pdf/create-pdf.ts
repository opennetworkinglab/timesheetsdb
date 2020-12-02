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

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

import { writeFile } from 'fs.promises';

export class PdfContent {

  name: string;
  data: string;
}


export const createPdf = async (pdfContents: PdfContent[]) => {

  const xValue1 = 50;
  const xValue2 = 250;
  const headingFont = 18;
  const paraFont = 15;

  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  page.drawText('Direct Labor', {
    x: xValue1,
    y: height - 4 * headingFont,
    size: headingFont,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  page.drawText('Hours', {
    x: xValue2,
    y: height - 4 * headingFont,
    size: headingFont,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });


  for(let i = 0; i < pdfContents.length; i++){

    page.drawText(pdfContents[i].name, {
      x: xValue1,
      y: height - 4 * headingFont - (paraFont * ((i+1) * 1.5) + 10),
      size: paraFont,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(pdfContents[i].data, {
      x: xValue2,
      y: height - 4 * headingFont - (paraFont * ((i+1) * 1.5) + 10),
      size: paraFont,
      font: timesRomanFont,
      color: rgb(0, 0, 0.),
    });
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  return await pdfDoc.save();
  // writeFile('out.pdf', pdfBytes).then(()=>{
  //   console.log("dsasdad");
  // });
}
