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

import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { TsWeeklyService } from './tsweekly.service';
import { TsWeekly } from './tsweekly.entity';
import { UpdateTsWeeklyDto } from './dto/update-tsweekly.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetTsUser } from '../auth/get-tsuser.decorator';
import { TsUser } from '../auth/tsuser.entity';
import { UpdateResult } from 'typeorm';

@Controller('tsweekly')
export class TsWeeklyController {

  constructor(private tsWeeklyService: TsWeeklyService) {}


  @Get(':emailId')
  @UseGuards(AuthGuard())
  getTsWeekly(@GetTsUser() tsUser: TsUser): Promise<TsWeekly[]> {
    return this.tsWeeklyService.getTsWeekly(tsUser);
  }

  @Patch(':emailId/:weekId')
  @UseGuards(AuthGuard())
  UpdateTsWeeklyUser(@GetTsUser() tsUser: TsUser,
                     @Param('weekId') weekId,
                     @Body() updateTsWeeklyDto: UpdateTsWeeklyDto): Promise<UpdateResult> {
    return this.tsWeeklyService.updateTsWeeklyUser(tsUser, weekId, updateTsWeeklyDto);
  }

  @Get('admin/update') // no auth
  UpdateTsWeeklyAdmin() {
    return this.tsWeeklyService.updateTsWeeklyAdmin();
  }
}
