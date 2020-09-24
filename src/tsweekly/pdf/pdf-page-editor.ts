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


import { Color, PDFFont, PDFForm, PDFPage } from 'pdf-lib';

export class PdfPageEditor {

  // Page details
  private page;
  private readonly height;
  private readonly width;

  // Table
  private tableStartX;
  private tableStartY
  private tableWidth;
  private tableHeight;
  private headerRow = false;
  private columns = [];
  private rows = [];

  // Form
  private userSign;
  private adminSign;

  constructor(page: PDFPage) {

    this.page = page;

    const { height, width } = page.getSize();
    this.height = height;
    this.width = width;

  }

  public getTableBottom(){
    return this.tableStartX + this.tableHeight;
  }

  public  addText(startX: number, startY: number, font: PDFFont, fontSize: number, color: Color, text: string){

    this.page.drawText(text, {
      x: startX,
      y: this.height - startY,
      size: fontSize,
      font: font,
      color: color,
    });
  }

  /**
   * Start position of table
   * @param startX
   * @param startY
   */
  public tableStart(startX: number, startY: number){

    this.tableStartX = startX;
    this.tableStartY = this.height - startY;
    this.tableHeight = 0;
    this.tableWidth = 0;

  }

  public addColumns(width: number, noCols: number){

    if(this.columns.length === 0) {

      this.columns.push(width);
      this.tableWidth += width;
      noCols--;
    }

    for (let i = 0; i < noCols; i++) {

      this.columns.push(width);
      this.tableWidth += width;
    }
  }

  public addHeaderRow(height: number){

    this.headerRow = true;
    this.addRows(height, 1);
  }

  public addRows(height: number, noRows: number,){

    if(this.rows.length === 0) {

      this.rows.push(height);
      this.tableHeight += height;
      noRows--;
    }

    for (let i = 0; i < noRows; i++) {

      this.rows.push(height);
      this.tableHeight += height;
    }
  }

  public drawTable(color: Color, thickness: number, totalLineOffset: number){

    // height
    this.page.drawLine({
      start: { x: this.tableStartX, y: this.tableStartY },
      end: { x: this.tableStartX, y: this.tableStartY - this.tableHeight},
      thickness: thickness,
      color: color,
    });

    let x = this.tableStartX;

    let newStartY = this.tableStartY;

    if(this.headerRow){
      newStartY -= this.rows[0];
    }

    // height
    for(let i = 0; i < this.columns.length; i++){

      x += this.columns[i];

      if(i === this.columns.length - 1 && this.headerRow){
        newStartY = this.tableStartY;
      }

      this.page.drawLine({
        start: { x: x, y: newStartY },
        end: { x: x, y: this.tableStartY - this.tableHeight },
        thickness: thickness,
        color: color,
      });
    }

    // width
    this.page.drawLine({
      start: { x: this.tableStartX, y: this.tableStartY },
      end: { x: this.tableStartX + this.tableWidth, y: this.tableStartY},
      thickness: thickness,
      color: color,
    });

    let y = this.tableStartY;

    // height
    for(let i = 0; i < this.rows.length; i++){

      y -= this.rows[i];

      this.page.drawLine({
        start: { x: this.tableStartX, y: y },
        end: { x: this.tableStartX + this.tableWidth, y: y },
        thickness: thickness,
        color: color,
      });

      if(i == this.rows.length - 2) {

        this.page.drawLine({
          start: { x: this.tableStartX, y: y - totalLineOffset },
          end: { x: this.tableStartX + this.tableWidth, y: y - totalLineOffset },
          thickness: thickness,
          color: color,
        });
      }
    }
  }

  public populateHeader(title: string, columnTitles: string[], font: PDFFont, titleFontSize: number, fontSize: number, color: Color){

    const titleX =  this.tableStartX + (this.tableWidth / 2) - (font.widthOfTextAtSize(title, titleFontSize) / 2);

    const titleY =  this.tableStartY - font.heightAtSize(fontSize, { descender: true }) - (this.rows[0] * 0.10);

    this.page.drawText(title, {
      x: titleX,
      y: titleY,
      size: titleFontSize,
      font: font,
      color: color,
    });

    let columnTitleX = this.tableStartX + this.columns[0];
    const columnTitleY = this.tableStartY - (this.rows[0] * 0.90);

    for(let i = 0; i < columnTitles.length; i++){

      columnTitleX += (this.columns[i + 1] / 2) - (font.widthOfTextAtSize(columnTitles[i], fontSize) / 2);

      this.page.drawText(columnTitles[i], {
        x: columnTitleX,
        y: columnTitleY,
        size: fontSize,
        font: font,
        color: color,
      });

      columnTitleX += (this.columns[i + 1] / 2) + (font.widthOfTextAtSize(columnTitles[i], fontSize) / 2)
    }
  }

  public populateColumnHeadings(text: string[], font: PDFFont, fontSize: number, color: Color){

    let startX = this.tableStartX + this.columns[0];
    let startY = this.tableStartY;

    let headerTrue = 0;
    if(this.headerRow){
      startY -= this.rows[0];
      headerTrue = 1;
    }

    for(let i = 0; i < text.length; i++){

      let pX = startX + this.columns[i + 1];
      let pY = startY - this.rows[headerTrue];

      const height = font.heightAtSize(fontSize, { descender: true });
      const width = font.widthOfTextAtSize(text[i][0] + " " + text[i][1] + " " + text[i][2], fontSize);

      pX -= (this.columns[i + 1] / 2) + (width / 2);
      pY += (this.rows[headerTrue] / 2) - height / 2;

      this.page.drawText(text[i][0] + " " + text[i][1] + " " + text[i][2] , {
        x: pX,
        y: pY,
        size: fontSize,
        font: font,
        color: color,
      });
      startX = pX + (this.columns[i] / 2) + (width / 2);
    }
  }

  public populateRowHeadings(text: string[], font: PDFFont, fontSize: number, color: Color){

    let headerTrue = 0;
    const startX = this.tableStartX;
    let startY = this.tableStartY;

    if(this.headerRow){
      startY -= this.rows[0];
      headerTrue = 1
    }

    for(let i = 0; i < text.length; i++){

      let pX = startX + this.columns[0];
      let pY = startY - this.rows[i + headerTrue];

      const height = font.heightAtSize(fontSize, { descender: true });

      if(text[i].includes("\n")){

        const twoText = text[i].split("\n");

        const text1Width = pX - (this.columns[0] / 2) - (font.widthOfTextAtSize(twoText[0], fontSize) / 2);
        pY += (this.rows[i + headerTrue] / 2);

        this.page.drawText(twoText[0], {
          x: text1Width,
          y: pY + height / 2 - 5,
          size: fontSize,
          font: font,
          color: color,
        });

        const text2Width = pX - (this.columns[0] / 2) - (font.widthOfTextAtSize(twoText[1], fontSize) / 2);

        this.page.drawText(twoText[1], {
          x: text2Width,
          y: pY - height / 2 - 5,
          size: fontSize,
          font: font,
          color: color,
        });
        startY = pY - (this.rows[i + headerTrue] / 2);
      }
      else {

        const width = font.widthOfTextAtSize(text[i], fontSize);

        pX -= (this.columns[0] / 2) + (width / 2);
        pY += (this.rows[i + headerTrue] / 2) - height / 2;

        this.page.drawText(text[i], {
          x: pX,
          y: pY,
          size: fontSize,
          font: font,
          color: color,
        });
        startY = pY - (this.rows[i + headerTrue] / 2) + height / 2;
      }
    }
  }

  public populateCells(values: string[][], font: PDFFont, fontSize: number, color: Color){

    let x = this.tableStartX + this.columns[0];
    let y = this.tableStartY - this.rows[0];
    let yTrack = 0;
    if(this.headerRow){
      y -= this.rows[1];
      yTrack = 1;
    }

    const startY = y;

    for(let i = 0; i < values.length; i++){

      x += (this.columns[i + 1] / 2);

      for(let j = 0; j < values[i].length; j++){

        x -= (font.widthOfTextAtSize(values[i][j], fontSize) / 2);
        y -= (this.rows[j + 1 + yTrack] / 2) + (font.heightAtSize(fontSize, { descender: true }) / 2)

        this.page.drawText(values[i][j], {
          x: x,
          y: y,
          size: fontSize,
          font: font,
          color: color,
        });

        y -= (this.rows[j + 1 + yTrack] / 2) - (font.heightAtSize(fontSize, { descender: true }) / 2)
        x += (font.widthOfTextAtSize(values[i][j], fontSize) / 2);
      }
      y = startY;
      x += (this.columns[i + 1] / 2)
    }
  }

  public addSign(form){
    const textField = form.createTextField('**signature_1**')
    textField.addToPage(this.page, {
      x: 60,
      y: 60,
      width: 100,
      height: 100,
    })
  }
}