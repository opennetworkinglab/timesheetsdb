/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Module } from '@nestjs/common';
import { TsuserController } from './tsuser.controller';
import { TsuserService } from './tsuser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TsweekRepository } from '../tsweek/tsweek.repository';
import { TsuserRepository } from './tsuser.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TsuserRepository])
  ],
  controllers: [TsuserController],
  providers: [TsuserService]
})
export class TsuserModule {}
