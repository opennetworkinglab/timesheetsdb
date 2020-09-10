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
import { TsweeklyService } from './tsweekly.service';
import { FilterTsweeklyDto } from './dto/filter-tsweekly.dto';
import { Tsweekly } from './tsweekly.entity';
import { CreateTsweeklyDto } from './dto/create-tsweekly.dto';
import { EmailValidationPipe } from '../pipes/email-validation.pipe';
import { UpdateTsweeklyDto } from './dto/update-tsweekly.dto';

@Controller('tsweekly')
export class TsweeklyController {

  constructor(private tsweeklyService: TsweeklyService) {}

  /**
   * Returns a Promise of an array of Tsweekly based on filter. One to many Tsweekly can be returned.
   * @param filterTsweeklyDto
   */
  @Get()
  getTsweekly(@Query() filterTsweeklyDto: FilterTsweeklyDto): Promise<Tsweekly[]> {
    return this.tsweeklyService.getTsweekly(filterTsweeklyDto);
  }

  @Get(':emailId')
  getTsweeklyById(@Param('emailId') emailId): Promise<Tsweekly[]> {
    return this.tsweeklyService.getTsweeklyById(emailId);
  }

  @Post()
  createTsweekly(@Body('email', EmailValidationPipe) email,
                 @Body() createTsweeklyDto: CreateTsweeklyDto): Promise<void> {
    return this.tsweeklyService.createTsweekly(createTsweeklyDto);
  }

  @Patch(':emailId/:weekId')
  UpdateTsweeklyUser(@Param('emailId') emailId,
                     @Param('weekId') weekId,
                     @Body() updateTsweeklyDto: UpdateTsweeklyDto,
                     @Body('username') username,
                     @Body('userSigned1') userSigned1) { // Will be removed. In as can't pass date object in postman

    return this.tsweeklyService.updateTsweeklyUser(username, emailId, weekId, updateTsweeklyDto, userSigned1);
  }

  @Patch(':emailId/:weekId/adminsign')
  UpdateTsweeklyAdmin(@Param('emailId') emailId,
                      @Param('weekId') weekId,
                      @Body() updateTsweeklyDto: UpdateTsweeklyDto,
                      @Body('username') username,
                      @Body('userSigned1') userSigned1) { // @Param
    return this.tsweeklyService.updateTsweeklyAdmin(username, emailId, weekId, updateTsweeklyDto, userSigned1);
  }
}
