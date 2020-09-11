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

import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TsdayService } from './tsday.service';
import { FilterTsDayDto } from './dto/filter-tsday.dto';
import { TsDay } from './tsday.entity';
import { CreateTsDayDto } from './dto/create-tsday.dto';
import { EmailValidationPipe } from '../pipes/email-validation.pipe';
import { UpdateTsdayDto } from './dto/update-tsday.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tsday')
@UseGuards(AuthGuard())
export class TsdayController {

  constructor(private tsdayService: TsdayService) {}

  /**
   * Returns a Promise of an array of Tsday based on filter. One to many Tsday can be returned.
   * @param filterTsdayDto
   */
  @Get()// Pass id as param??
  getTsdays(@Query() filterTsdayDto: FilterTsDayDto): Promise<TsDay[]> {
    return this.tsdayService.getTsdays(filterTsdayDto);
  }

  @Get(':emailId')
  getTsdayById(@Param('emailId') emailId): Promise<TsDay[]> {
    return this.tsdayService.getTsdayById(emailId);
  }

  @Post()
  createTsday(@Body('email', EmailValidationPipe) email,
              @Body() createTsdayDto: CreateTsDayDto): Promise<void> {
    return this.tsdayService.createTsday(createTsdayDto);
  }

  // @Patch(':emailId/:dayId')
  // // token to be passed
  // updateTsdayMins(@Param('emailId') emailId,
  //                 @Param('dayId') dayId,
  //                 @Body('username') username,
  //                 @Body() updateTsdayDto: UpdateTsdayDto) {
  //   return this.tsdayService.updateTsdayMins(username, emailId, new Date(dayId), updateTsdayDto);
  // }
}