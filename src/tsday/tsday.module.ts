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
import { TsDayController } from './tsday.controller';
import { TsDayService } from './tsday.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TsDayRepository } from './tsday.repository';
import { TsUserRepository } from '../auth/tsuser.repository';
import { AuthModule } from '../auth/auth.module';
import { TsWeekRepository } from '../tsweek/tsweek.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TsDayRepository, TsWeekRepository]),
    AuthModule,
  ],
  controllers: [TsDayController],
  providers: [TsDayService]
})
export class TsDayModule {}
