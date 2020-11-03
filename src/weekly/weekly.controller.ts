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
import { UpdateResult } from 'typeorm';
import { WeeklyService } from './weekly.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Weekly } from './weekly.entity';
import { UpdateWeeklyDto } from './dto/update-weekly.dto';

@Controller('weekly')
export class WeeklyController {

  constructor(private weeklyService: WeeklyService) {
  }

  @Get(':emailId/:weekId')
  @UseGuards(AuthGuard())
  getWeekly(@GetUser() user: User,
            @Param('weekId') weekId): Promise<Weekly> {
    return this.weeklyService.getWeekly(user, weekId);
  }

  @Patch(':emailId/:weekId')
  @UseGuards(AuthGuard())
  UpdateWeeklyUser(@GetUser() user: User,
                     @Param('weekId') weekId,
                     @Body() updateWeeklyDto: UpdateWeeklyDto): Promise<{ viewRequest }> {
    return this.weeklyService.updateWeeklyUser(user, weekId, updateWeeklyDto);
  }

  @Get('supervisor/update') // no auth
  UpdateWeeklySupervisor() {
    return this.weeklyService.updateWeeklySupervisor();
  }
}
