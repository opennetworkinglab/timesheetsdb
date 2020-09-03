/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
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

  @Get()
  getTsweek(@Query() filterTsuserDto: FilterTsuserDto): Promise<Tsuser[]> {
    return this.tsuserService.getUser(filterTsuserDto);
  }

  @Post()
  @ApiResponse({ status: 201, description: "User added" })
  createTsweek(@Body() createTsuserDto:  CreateTsuserDto): Promise<Tsuser> {
    return this.tsuserService.createUser(createTsuserDto);
  }
}
