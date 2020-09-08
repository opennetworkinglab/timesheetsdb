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

import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TsdayService } from './tsday.service';
import { FilterTsdayDto } from './dto/filter-tsday.dto';
import { Tsday } from './tsday.entity';
import { CreateTsdayDto } from './dto/create-tsday.dto';
import { EmailValidationPipe } from '../pipes/email-validation.pipe';
import { UpdateResult } from 'typeorm';
import { UpdateTsdayDto } from './dto/update-tsday.dto';

@Controller('tsday')
export class TsdayController {

  constructor(private tsdayService: TsdayService) {}

  /**
   * Returns a Promise of an array of Tsday based on filter. One to many Tsday can be returned.
   * @param filterTsdayDto
   */
  @Get()// Pass id as param??
  getTsdays(@Query() filterTsdayDto: FilterTsdayDto): Promise<Tsday[]> {
    return this.tsdayService.getTsdays(filterTsdayDto);
  }

  @Get(':emailId')
  getTsdayById(@Param('emailId') emailId): Promise<Tsday[]> {
    return this.tsdayService.getTsdayById(emailId);
  }

  @Post()
  createTsday(@Body('email', EmailValidationPipe) email,
              @Body() createTsdayDto: CreateTsdayDto): Promise<void> {
    return this.tsdayService.createTsday(createTsdayDto);
  }

  @Patch(':emailId/:dayId')
  // Pass day in by body? Can use filter
  updateTsdayMins(@Param('emailId') emailId, @Param('dayId') dayId, @Body() updateTsdayDto: UpdateTsdayDto) {
    return this.tsdayService.updateTsdayMins(emailId, new Date(dayId), updateTsdayDto);
  }
}