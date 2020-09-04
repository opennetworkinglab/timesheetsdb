/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Module } from '@nestjs/common';
import { TsweeklyController } from './tsweekly.controller';
import { TsweeklyService } from './tsweekly.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TsweeklyRepository } from './tsweekly.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TsweeklyRepository])
  ],
  controllers: [TsweeklyController],
  providers: [TsweeklyService]
})
export class TsweeklyModule {}
