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
import { TsWeeklyService } from './tsweekly.service';
import { TsWeekly } from './tsweekly.entity';
import { CreateTsWeeklyDto } from './dto/create-tsweekly.dto';
import { EmailValidationPipe } from '../pipes/email-validation.pipe';
import { UpdateTsWeeklyDto } from './dto/update-tsweekly.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetTsUser } from '../auth/get-tsuser.decorator';
import { TsUser } from '../auth/tsuser.entity';
import { UpdateResult } from 'typeorm';

@Controller('tsweekly')
@UseGuards(AuthGuard())
export class TsWeeklyController {

  constructor(private tsWeeklyService: TsWeeklyService) {}

  @Post()
  createTsWeekly(@GetTsUser() tsUser: TsUser,
                 @Body() createTsWeeklyDto: CreateTsWeeklyDto,
  ): Promise<void> {
    return this.tsWeeklyService.createTsWeekly(tsUser, createTsWeeklyDto);
  }

  @Get()
  getTsWeekly(@GetTsUser() tsUser: TsUser): Promise<TsWeekly[]> {
    return this.tsWeeklyService.getTsWeekly(tsUser);
  }

  @Patch(':weekId')
  UpdateTsWeeklyUser(@GetTsUser() tsUser: TsUser,
                     @Param('weekId') weekId,
                     @Body() updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {
    return this.tsWeeklyService.updateTsWeeklyUser(tsUser, weekId, updateTsWeeklyDto);
  }

  @Patch(':emailId/:weekId/')
  UpdateTsWeeklyAdmin(@GetTsUser() tsUser: TsUser,
                      @Param('emailId') emailId,
                      @Param('weekId') weekId,
                      @Body() updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {
    return this.tsWeeklyService.updateTsWeeklyAdmin(tsUser, emailId, weekId, updateTsWeeklyDto);
  }

  // @Get(':emailId')
  // getTsweeklyById(@Param('emailId') emailId): Promise<TsWeekly[]> {
  //   return this.tsWeeklyService.getTsweeklyById(emailId);
  // }
  //
  // @Post()
  // createTsweekly(@Body('email', EmailValidationPipe) email,
  //                @Body() createTsweeklyDto: CreateTsweeklyDto): Promise<void> {
  //   return this.tsWeeklyService.createTsweekly(createTsweeklyDto);
  // }
  //
  // @Patch(':emailId/:weekId')
  // UpdateTsweeklyUser(@Param('emailId') emailId,
  //                    @Param('weekId') weekId,
  //                    @Body() updateTsweeklyDto: UpdateTsweeklyDto,
  //                    @Body('username') username,
  //                    @Body('userSigned1') userSigned1) { // Will be removed. In as can't pass date object in postman
  //
  //   return this.tsWeeklyService.updateTsweeklyUser(username, emailId, weekId, updateTsweeklyDto, userSigned1);
  // }
  //
  // @Patch(':emailId/:weekId/adminsign')
  // UpdateTsweeklyAdmin(@Param('emailId') emailId,
  //                     @Param('weekId') weekId,
  //                     @Body() updateTsweeklyDto: UpdateTsweeklyDto,
  //                     @Body('username') username,
  //                     @Body('userSigned1') userSigned1) { // @Param
  //   return this.tsWeeklyService.updateTsweeklyAdmin(username, emailId, weekId, updateTsweeklyDto, userSigned1);
  // }
}
