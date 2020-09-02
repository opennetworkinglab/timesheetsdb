/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Controller, Get, Post, Query } from '@nestjs/common';
import { TsweekService } from './tsweek.service';
import { Tsweek } from './tsweek.entity';
import { FilterTsweekDto } from './dto/filter-tsweek.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('tsweek')
export class TsweekController {

  constructor(private tsweekService: TsweekService) {}

  /**
   * Gets the ts weeks based on filter. No filter gets all weeks
   * @param filterTsweekDto
   */
  @Get()
  @ApiQuery({ name: 'year' })
  getTsweek(@Query() filterTsweekDto: FilterTsweekDto): Promise<Tsweek[]> {
    return this.tsweekService.getTsweek(filterTsweekDto);
  }

  @Post()
  createTsweek(): Promise<void> {
    return this.tsweekService.createTsweek();
  }
}
