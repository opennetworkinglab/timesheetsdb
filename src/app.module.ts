/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { Module } from '@nestjs/common';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TsweekModule } from './tsweek/tsweek.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TsweekModule,
  ],
})
export class AppModule {}
