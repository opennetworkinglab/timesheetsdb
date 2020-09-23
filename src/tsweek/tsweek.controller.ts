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

import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TsWeekService } from './tsweek.service';
import { TsWeek } from './tsweek.entity';
import { FilterTsWeekDto } from './dto/filter-tsweek.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('tsweek')
@UseGuards(AuthGuard())
export class TsWeekController {

  constructor(private tsWeekService: TsWeekService) {}

  /**
   * Returns a Promise of an array of Tsweek based on filter. One to many Tsweek can be returned.
   * @param filterTsweekDto
   */
  @Get()
  getTsweek(@Query() filterTsweekDto: FilterTsWeekDto): Promise<TsWeek[]> {
    return this.tsWeekService.getTsWeek(filterTsweekDto);
  }

  @Get(':id')
  async getTsweekById(@Param('id') id):Promise<TsWeek> {
    return this.tsWeekService.getTsWeekById(id);
  }

  @Post()
  createTsWeek(): Promise<void> {
    return this.tsWeekService.createTsWeek();
  }

}
