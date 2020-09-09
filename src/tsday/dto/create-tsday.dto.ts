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
import { IsDate, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
const MIN_MINS = 0;
const MAX_MINS = 0;

export class CreateTsdayDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  day: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  weekid: number

  @ApiProperty()
  @IsInt()
  @Min(MIN_MINS)
  @Max(MAX_MINS)
  darpamins: number

  @ApiProperty()
  @IsInt()
  @Min(MIN_MINS)
  @Max(MAX_MINS)
  nondarpamins: number

  @ApiProperty()
  @IsInt()
  @Min(MIN_MINS)
  @Max(MAX_MINS)
  sickmins: number

  @ApiProperty()
  @IsInt()
  @Min(MIN_MINS)
  @Max(MAX_MINS)
  ptomins: number

  @ApiProperty()
  @IsInt()
  @Min(MIN_MINS)
  @Max(MAX_MINS)
  holidaymins: number
}