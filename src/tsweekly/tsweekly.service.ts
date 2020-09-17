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
import { writeFileSync } from "fs";
import { TsDay } from '../tsday/tsday.entity';
import { TsWeek } from '../tsweek/tsweek.entity';

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

    // const existingPdfBytes = readFileSync('2pac.pdf');
    //
    // const pdfDoc = await PDFDocument.load(existingPdfBytes);
    //
    // const pages = pdfDoc.getPages();
    // const firstPage = pages[0];

    // Create a new PDFDocument
    // const pdfDoc = await PDFDocument.create()
    // Embed the Times Roman font
    // const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    // // Add a blank page to the document
    // const page = pdfDoc.addPage()
    // // Get the width and height of the page
    // const { width, height } = page.getSize()
    // // Draw a string of text toward the top of the page
    // const fontSize = 30

    // firstPage.drawText('Creating PDFs in JavaScript is awesome!!!!!!!', {
    //   x: 50,
    //   y: height - 4 * fontSize,
    //   size: fontSize,
    //   font: timesRomanFont,
    //   color: rgb(0, 0.53, 0.71),
    // })
    // Serialize the PDFDocument to bytes (a Uint8Array)
    // const pdfBytes = await pdfDoc.save()

    // writeFileSync('2pac.pdf', pdfBytes);

    return await this.tsWeeklyRepository.updateTsWeeklyUser(tsUser, weekId, updateTsWeeklyDto);
  }

  async updateTsWeeklyAdmin(tsUser: TsUser, emailId: string, weekId: number, updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {
    return this.tsWeeklyRepository.updateTsWeeklyAdmin(tsUser, emailId, weekId, updateTsWeeklyDto);
  }
  static async createPdf(days: TsDay[], week: TsWeek){

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()
    // Embed the Times Roman font
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    // Add a blank page to the document
    const page = pdfDoc.addPage()
    // Get the width and height of the page
    const { width, height } = page.getSize()
    // Draw a string of text toward the top of the page
    let fontSize = 20


    page.drawText(days[0].tsUser.firstName + " " + days[0].tsUser.lastName + ": " + days[0].tsUser.email, {
      x: 20,
      y: height - 40,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    });

    fontSize = 15
    page.drawText("Darpa Allocation: " + days[0].tsUser.darpaAllocationPct + "%", {
      x: 20,
      y: height - 60,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    });

    fontSize = 10;

    page.drawText('Week: ' + TsWeeklyService.dateFormat(week.begin.toString()) + " - " + TsWeeklyService.dateFormat(week.end.toString()) + "\tWeekno:" + week.weekNo , {
      x: 20,
      y: height - 85,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    });

    fontSize = 15;
    // Vertical line loop
    for(let i = 0, j = 90; i < 7; i++, j += 30) {

      page.drawLine({
        start: { x: 15, y: height - j },
        end: { x: width - 10, y: height - j },
        thickness: 1,
        color: rgb(0.256, 0.256, 0.256),
      });
    }

    // First horizontal line
    page.drawLine({
      start: { x: 15, y: height - 90 },
      end: { x: 15, y: height - 270 },
      color: rgb(0.256, 0.256, 0.256),
    });

    // Loop for vertical lines
    for(let i = 0, j = 130; i < 8; i++, j += 65) {

      page.drawLine({
        start: { x: j, y: height - 90 },
        end: { x: j, y: height - 270 },
        color: rgb(0.256, 0.256, 0.256),
      });
    }

    fontSize = 12;

    const rowTitles = ["Darpa Hrs", "Non Darpa Hrs", "Sick Hrs", "PTO Hrs", "Holiday Hrs"];

    // Loop for row titles
    for(let i = 0, j = 139.5; i < 5; i++, j += 30){

      page.drawText(rowTitles[i], {
        x: 20,
        y: height - j,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });
    }

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Loop for week days
    for(let i = 0, k = 150; i < 7; i++, k += 65) {

      page.drawText(weekDays[i], {
        x: k,
        y: height - 108.5,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });
    }

    fontSize = 11;
    for(let i = 0, x= 150, y = 138.5; i < 7; i++, x += 65) {

      page.drawText(TsWeeklyService.minsToHrMins(days[i].darpaMins), {
        x: x,
        y: height - y,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });

      y += 30;

      page.drawText(TsWeeklyService.minsToHrMins(days[i].nonDarpaMins), {
        x: x,
        y: height - y,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });

      y += 30;

      page.drawText(TsWeeklyService.minsToHrMins(days[i].sickMins), {
        x: x,
        y: height - y,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });

      y += 30;

      page.drawText(TsWeeklyService.minsToHrMins(days[i].ptoMins), {
        x: x,
        y: height - y,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });

      y += 30;

      page.drawText(TsWeeklyService.minsToHrMins(days[i].holidayMins), {
        x: x,
        y: height - y,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });

      y = 138.5
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    // const pdfBytes = await pdfDoc.saveAsBase64();
    writeFileSync('ss.pdf', pdfBytes);
  }

  private static minsToHrMins(mins: number): string {

    let time;

    const hours = Math.trunc(mins / 60);
    const minsLeft = mins - hours;
    time = hours.toString();

    if(minsLeft === 45) {
      return time += "¾";
    }

    if(minsLeft === 30) {
      return  time += "½";
    }

    return time += "¼"
  }

  private static dateFormat(date: string): string{

    const dateArr = date.split("-");

    return dateArr[0] + "/" + dateArr[1] + "/" + dateArr[2];
  }
}
