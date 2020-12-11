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

import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WeekService } from './week.service';
import { Week } from './week.entity';


@Controller('week')
export class WeekController {

  constructor(private weekService: WeekService) {}

  @Get()
  @UseGuards(AuthGuard())
  getWeek(): Promise<Week[]> {
    return this.weekService.getWeek();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getWeekById(@Param('id') id):Promise<Week> {
    return this.weekService.getWeekById(id);
  }

  @Post()
  async createWeeks(): Promise<void>{
    return this.weekService.createWeeks();
  }
}
