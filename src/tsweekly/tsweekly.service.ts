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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TsWeeklyRepository } from './tsweekly.repository';
import { TsWeekly } from './tsweekly.entity';
import { CreateTsWeeklyDto } from './dto/create-tsweekly.dto';
import { UpdateTsWeeklyDto } from './dto/update-tsweekly.dto';
import { UpdateResult } from 'typeorm';
import { TsUser } from '../auth/tsuser.entity';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { readFileSync, writeFileSync } from 'fs';
import { TsDay } from '../tsday/tsday.entity';
import { TsWeek } from '../tsweek/tsweek.entity';
import { PdfPageEditor } from './pdf/pdf-page-editor';
import * as jwt from 'jsonwebtoken';
import { payload } from '../config/docusign.config';
import axios from 'axios';
import { signingViaEmail } from './docusign/send-email-sign';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdays = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun", "Total"];


@Injectable()
export class TsWeeklyService {

  constructor(
    @InjectRepository(TsWeeklyRepository)
    private tsWeeklyRepository: TsWeeklyRepository) {}

  async createTsWeekly(tsUser: TsUser, createTsWeeklyDto: CreateTsWeeklyDto): Promise<void> {
      return this.tsWeeklyRepository.createTsWeekly(tsUser, createTsWeeklyDto);
  }

  async getTsWeekly(tsUser: TsUser): Promise<TsWeekly[]> {
    return this.tsWeeklyRepository.getTsWeekly(tsUser);
  }

  async updateTsWeeklyUser(tsUser: TsUser, weekId: number, updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {

    // CREATE PDF
    // POPULATE WITH TSDAYS ON A GIVEN TSWEEK

    // TEMPLATE -> FONT - SIZE - TYPE
    //          -> General Text
    //          -> send to docusign.

    return await this.tsWeeklyRepository.updateTsWeeklyUser(tsUser, weekId, updateTsWeeklyDto);
  }

  async updateTsWeeklyAdmin(tsUser: TsUser, emailId: string, weekId: number, updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {
    return this.tsWeeklyRepository.updateTsWeeklyAdmin(tsUser, emailId, weekId, updateTsWeeklyDto);
  }

  public static async createPdf(days: TsDay[], week: TsWeek){

    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const page = pdfDoc.addPage([841.89, 595.28]);
    const form = pdfDoc.getForm()
    // const page = pdfDoc.addPage(PageSizes.A4);
    const pdfPageEditor = new PdfPageEditor(page);

    pdfPageEditor.addText(20, 40, timesRomanFont, 25, rgb(0, 0.53, 0.71), days[0].tsUser.firstName + " " + days[0].tsUser.lastName + ": " + days[0].tsUser.email);
    pdfPageEditor.addText(20, 85, timesRomanFont, 15, rgb(0, 0.53, 0.71), 'Week: ' + TsWeeklyService.dateFormat(week.begin.toString()) + " - " + TsWeeklyService.dateFormat(week.end.toString()) + "\tWeek no: " + week.weekNo);

    pdfPageEditor.tableStart(20, 100);
    pdfPageEditor.addColumns(90, 1);
    pdfPageEditor.addColumns(90, 8);
    pdfPageEditor.addHeaderRow(60);
    pdfPageEditor.addRows(30, 1);
    pdfPageEditor.addRows(40, 6);
    pdfPageEditor.drawTable(rgb(0.256, 0.256, 0.256), 1, 5);

    const rowTitles = ["Date", "Darpa\nHR001120C0107", "Non Darpa", "Sick", "PTO", "Holiday", "Total"];
    pdfPageEditor.populateRowHeadings(rowTitles, timesRomanFont, 12, rgb(0, 0.53, 0.71));

    // Convert dates to string and months to word
    const dateString = []
    for(let i = 0; i < days.length; i++){

      const date = days[i].day.toString().split("-");

      dateString.push([date[2], months[Number(date[1]) - 1], date[0]]);
    }
    const dates = [dateString[0], dateString[1], dateString[2], dateString[3], dateString[4], dateString[5], dateString[6]];
    pdfPageEditor.populateColumnHeadings(dates, timesRomanFont, 12, rgb(0, 0.53, 0.71));

    pdfPageEditor.populateHeader("Hours", weekdays, timesRomanFont, 15, 13, rgb(0, 0.53, 0.71));

    const cellValues = [];
    for(let i = 0; i < 7; i++){

      cellValues[i] = [];

      cellValues[i][0] = days[i].darpaMins / 60
      cellValues[i][1] = days[i].nonDarpaMins / 60;
      cellValues[i][2] = days[i].sickMins / 60
      cellValues[i][3] = days[i].ptoMins / 60
      cellValues[i][4] = days[i].holidayMins / 60
      cellValues[i][5] = (days[i].darpaMins / 60) + (days[i].nonDarpaMins / 60) + (days[i].sickMins / 60) + (days[i].ptoMins / 60) + (days[i].holidayMins / 60);
    }
    cellValues[7] = [];
    for(let i = 0; i < 6; i++){

      cellValues[7][i] = cellValues[0][i] + cellValues[1][i] + cellValues[2][i] + cellValues[3][i] +
        cellValues[4][i] + cellValues[5][i] + cellValues[6][i];
    }
    for(let i = 0; i < cellValues.length; i++){
      for(let j = 0; j < cellValues[i].length; j++){

        cellValues[i][j] = cellValues[i][j].toString();
      }
    }
    pdfPageEditor.populateCells(cellValues, timesRomanFont, 12, rgb(0, 0.53, 0.71))
    pdfPageEditor.addSign(form);

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    // const pdfBytes = await pdfDoc.saveAsBase64();

    writeFileSync('ss.pdf', pdfBytes); // writing the file locally
  }

  public static async sendEmail(args){

    const privateKey = readFileSync('private.key');

    const jwtToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
    });

    const token = await axios.post("https://account-d.docusign.com/oauth/token", {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken
      }
    );

    const cellValues = [];
    for(let i = 0; i < 7; i++){

      cellValues[i] = [];

      cellValues[i][0] = args.days[i].darpaMins / 60
      cellValues[i][1] = args.days[i].nonDarpaMins / 60;
      cellValues[i][2] = args.days[i].sickMins / 60
      cellValues[i][3] = args.days[i].ptoMins / 60
      cellValues[i][4] = args.days[i].holidayMins / 60
      cellValues[i][5] = (args.days[i].darpaMins / 60) + (args.days[i].nonDarpaMins / 60) + (args.days[i].sickMins / 60) + (args.days[i].ptoMins / 60) + (args.days[i].holidayMins / 60);
    }
    cellValues[7] = [];
    for(let i = 0; i < 6; i++){

      cellValues[7][i] = cellValues[0][i] + cellValues[1][i] + cellValues[2][i] + cellValues[3][i] +
        cellValues[4][i] + cellValues[5][i] + cellValues[6][i];
    }
    for(let i = 0; i < cellValues.length; i++){
      for(let j = 0; j < cellValues[i].length; j++){

        cellValues[i][j] = cellValues[i][j].toString();
      }
    }

    args.htmlArgs.hours = cellValues;
    args.htmlArgs.week.begin = TsWeeklyService.dateFormat(args.htmlArgs.week.begin);
    args.htmlArgs.week.end = TsWeeklyService.dateFormat(args.htmlArgs.week.end);

     return await signingViaEmail.controller(token.data.access_token, args);
  }

  private static dateFormat(date: string): string{

    const dateArr = date.split("-");

    // month/day/year
    return dateArr[1] + "/" + dateArr[2] + "/" +dateArr[0] ;
  }
}
