/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Module } from '@nestjs/common';
import { TsweekController } from './tsweek.controller';
import { TsweekService } from './tsweek.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TsweekRepository } from './tsweek.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TsweekRepository])
  ],
  controllers: [TsweekController],
  providers: [TsweekService]
})
export class TsweekModule {}
