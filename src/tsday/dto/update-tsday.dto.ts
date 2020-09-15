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

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

const MIN_MINS = 0;
const MAX_MINS = 720;

export class UpdateTsDayDto {

  @ApiProperty()
  @IsInt()
  @Min(MIN_MINS)
  @Max(MAX_MINS)
  darpaMins: number

  @ApiProperty()
  @IsInt()
  @Min(MIN_MINS)
  @Max(MAX_MINS)
  nonDarpaMins: number

  @ApiProperty()
  @IsInt()
  @Min(MIN_MINS)
  @Max(MAX_MINS)
  sickMins: number

  @ApiProperty()
  @IsInt()
  @Min(MIN_MINS)
  @Max(MAX_MINS)
  ptoMins: number

  @ApiProperty()
  @IsInt()
  @Min(MIN_MINS)
  @Max(MAX_MINS)
  holidayMins: number
}