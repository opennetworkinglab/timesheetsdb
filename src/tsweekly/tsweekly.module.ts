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
import { TsWeeklyController } from './tsweekly.controller';
import { TsWeeklyService } from './tsweekly.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TsWeeklyRepository } from './tsweekly.repository';
import { TsUserRepository } from '../auth/tsuser.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TsWeeklyRepository, TsUserRepository]),
    AuthModule,
  ],
  controllers: [TsWeeklyController],
  providers: [TsWeeklyService]
})
export class TsWeeklyModule {}
