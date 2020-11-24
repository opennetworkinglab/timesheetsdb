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
import { OnfDayController } from './onf-day.controller';
import { OnfDayService } from './onf-day.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { OnfDayRepository } from './onf-day.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnfDayRepository]),
    AuthModule
  ],
  controllers: [OnfDayController],
  providers: [OnfDayService]
})
export class OnfDayModule {}
