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

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TsweekModule } from './tsweek/tsweek.module';
import { TsWeeklyModule } from './tsweekly/tsweekly.module';
import { TsDayModule } from './tsday/tsday.module';
import { AuthModule } from './auth/auth.module';
import typeorm from './config/typeorm.config';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TsUser } from './auth/tsuser.entity';
import { TsDay } from './tsday/tsday.entity';
import { TsWeek } from './tsweek/tsweek.entity';
import { TsWeekly } from './tsweekly/tsweekly.entity';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',// as 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'postgres'),
        password: configService.get('DATABASE_PASS', 'postgres'),
        database: 'timesheets',
        entities: [TsUser, TsDay, TsWeek, TsWeekly],
        // entities: [join(__dirname + '/../**/*.entity.{js,ts}')],
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TsweekModule,
    TsWeeklyModule,
    TsDayModule,
    AuthModule,
  ],
})
export class AppModule {}
