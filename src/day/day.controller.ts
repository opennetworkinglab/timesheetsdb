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
import { DayService } from './day.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Day } from './day.entity';
import { UpdateDayDto } from './dto/update-day.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('day')
@UseGuards(AuthGuard())
export class DayController {

  constructor(private dayService: DayService) {}

  @Get(':emailId/:weekId')
  getDays(@GetUser() user: User,
            @Param('weekId') weekId): Promise<Day[]> {
    return this.dayService.getDays(user, weekId);
  }

  @Patch(':emailId/:dayId')
  async updateDay(@GetUser() user: User,
                    @Param('dayId') dayId: Date,
                    @Body() updateDayDto: UpdateDayDto ): Promise<UpdateResult> {
    return this.dayService.updateDay(user, dayId, updateDayDto);
  }

}
