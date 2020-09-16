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
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { readFileSync, writeFile, writeFileSync } from 'fs';

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
}
