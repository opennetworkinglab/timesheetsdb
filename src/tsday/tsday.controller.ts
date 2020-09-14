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
import { TsDayService } from './tsday.service';
import { TsDay } from './tsday.entity';
import { CreateTsDayDto } from './dto/create-tsday.dto';
import { EmailValidationPipe } from '../pipes/email-validation.pipe';
import { UpdateTsdayDto } from './dto/update-tsday.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetTsUser } from '../auth/get-tsuser.decorator';
import { TsUser } from '../auth/tsuser.entity';

@Controller('tsday')
@UseGuards(AuthGuard())
export class TsDayController {

  constructor(private tsDayService: TsDayService) {}

  @Get()
  getTsDays(@GetTsUser() tsUser: TsUser, @Body('weekId') weekId): Promise<TsDay[]> {
    return this.tsDayService.getTsDays(tsUser, weekId);
  }

  // @Get(':emailId')
  // getTsdayById(@Param('emailId') emailId): Promise<TsDay[]> {
  //   return this.tsDayService.getTsdayById(emailId);
  // }

  @Post()
  createTsDay(@GetTsUser() tsUser: TsUser,
              @Body() createTsDayDto: CreateTsDayDto): Promise<void> {
    return this.tsDayService.createTsDay(tsUser, createTsDayDto);
  }

  // @Patch(':emailId/:dayId')
  // // token to be passed
  // updateTsdayMins(@Param('emailId') emailId,
  //                 @Param('dayId') dayId,
  //                 @Body('username') username,
  //                 @Body() updateTsdayDto: UpdateTsdayDto) {
  //   return this.tsDayService.updateTsdayMins(username, emailId, new Date(dayId), updateTsdayDto);
  // }
}