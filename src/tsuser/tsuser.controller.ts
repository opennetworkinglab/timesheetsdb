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

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TsuserService } from './tsuser.service';
import { FilterTsuserDto } from './dto/filter-user.dto';
import { Tsuser } from './tsuser.entity';
import { CreateTsuserDto } from './dto/create-user.dto';

@Controller('tsuser')
export class TsuserController {

  constructor(private tsuserService: TsuserService) {}

  /**
   * Returns a Promise of an array of Tsuser based on filter. One to many Tsuser can be returned.
   * @param filterTsweekDto
   */
  @Get()
  getTsusers(@Query() filterTsuserDto: FilterTsuserDto): Promise<Tsuser[]> {
    return this.tsuserService.getTsusers(filterTsuserDto);
  }

  @Post()
  @ApiResponse({ status: 201, description: "User added" })
  createTsuser(@Body() createTsuserDto:  CreateTsuserDto): Promise<void> {
    return this.tsuserService.createTsuser(createTsuserDto);
  }
}
