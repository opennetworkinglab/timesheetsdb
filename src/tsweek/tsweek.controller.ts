/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Controller, Get, Post, Query } from '@nestjs/common';
import { TsweekService } from './tsweek.service';
import { Tsweek } from './tsweek.entity';
import { FilterTsweekDto } from './dto/filter-tsweek.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('tsweek')
export class TsweekController {

  constructor(private tsweekService: TsweekService) {}

  /**
   * Returns a Promise of an array of Tsweek based on filter. One to many Tsweek can be returned.
   * @param filterTsweekDto
   */
  @Get()
  getTsweek(@Query() filterTsweekDto: FilterTsweekDto): Promise<Tsweek[]> {
    return this.tsweekService.getTsweek(filterTsweekDto);
  }

  @Post()
  @ApiResponse({ status: 201, description: "Table populated" })
  createTsweek(): Promise<void> {
    return this.tsweekService.createTsweek();
  }
}
