/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Module } from '@nestjs/common';
import { TsdayController } from './tsday.controller';
import { TsdayService } from './tsday.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TsdayRepository } from './tsday.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TsdayRepository])
  ],
  controllers: [TsdayController],
  providers: [TsdayService]
})
export class TsdayModule {}
