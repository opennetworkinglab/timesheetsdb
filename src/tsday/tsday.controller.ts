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
import { TsDayService } from './tsday.service';
import { TsDay } from './tsday.entity';
import { UpdateTsDayDto } from './dto/update-tsday.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetTsUser } from '../auth/get-tsuser.decorator';
import { TsUser } from '../auth/tsuser.entity';
import { UpdateResult } from 'typeorm';

@Controller('tsday')
@UseGuards(AuthGuard())
export class TsDayController {

  constructor(private tsDayService: TsDayService) {}

  @Get()
  getTsDays(@GetTsUser() tsUser: TsUser, @Body('weekId') weekId): Promise<TsDay[]> {
    return this.tsDayService.getTsDays(tsUser, weekId);
  }


  @Patch(':emailId/:dayId')
  async updateTsDay(@GetTsUser() tsUser: TsUser, @Param('dayId')dayId: Date, @Body() updateTsDayDto: UpdateTsDayDto ): Promise<UpdateResult> {
    return this.tsDayService.updateTsDay(tsUser, dayId, updateTsDayDto);
  }
}