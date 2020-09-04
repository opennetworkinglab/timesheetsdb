/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TsdayService } from './tsday.service';
import { FilterTsdayDto } from './dto/filter-tsday.dto';
import { Tsday } from './tsday.entity';
import { CreateTsdayDto } from './dto/create-tsday.dto';

@Controller('tsday')
export class TsdayController {

  constructor(private tsdayService: TsdayService) {}

  /**
   * Returns a Promise of an array of Tsday based on filter. One to many Tsday can be returned.
   * @param filterTsdayDto
   */
  @Get()
  getTsdays(@Query() filterTsdayDto: FilterTsdayDto): Promise<Tsday[]> {
    return this.tsdayService.getTsdays(filterTsdayDto);
  }

  @Post()
  createTsday(@Body() createTsdayDto: CreateTsdayDto): Promise<void> {
    return this.tsdayService.createTsday(createTsdayDto);
  }
}
