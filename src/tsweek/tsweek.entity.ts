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

import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tsweeks') // Database table name
@Unique('tsweek_year_week_uk', ['year', 'weekNo'])
@Unique('tsweek_begin_uk', ['begin'])
@Unique('tsweek_end_uk', ['end'])
export class TsWeek extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Column({ name: 'year' })
  year: number

  @ApiProperty()
  @Column({ name: 'week_no' })
  weekNo: number

  @ApiProperty()
  @Column({ name: 'month_no' })
  monthNo: number

  @ApiProperty()
  @Column({ name: 'begin' })
  begin: Date

  @ApiProperty()
  @Column({ name: 'end' })
  end: Date
}