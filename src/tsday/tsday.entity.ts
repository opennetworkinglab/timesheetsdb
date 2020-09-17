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

import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TsUser } from '../auth/tsuser.entity';
import { TsWeek } from '../tsweek/tsweek.entity';
import { type } from 'os';

@Entity('tsdays')
@Index(['tsUser', 'day'], { unique: true })
export class TsDay extends BaseEntity {

  @ApiProperty()
  @ManyToOne(() => TsUser, tsUser => tsUser.tsDays, { eager: true })
  @JoinColumn({ name: 'ts_user_email'})
  @PrimaryColumn({ name: 'ts_user_email', type: 'varchar' })
  tsUser: TsUser

  @ApiProperty()
  @PrimaryColumn({ type: 'date'})
  day: Date

  @ApiProperty()
  @ManyToOne(() => TsWeek)
  @JoinColumn({ name: 'week_id' })
  @Column( { name: 'week_id' })
  weekId: number

  @ApiProperty()
  @Column({ name: 'darpa_mins', nullable: true })
  darpaMins: number

  @ApiProperty()
  @Column({ name: 'non_darpa_mins', nullable: true })
  nonDarpaMins: number

  @ApiProperty()
  @Column({ name: 'sick_mins', nullable: true })
  sickMins: number

  @ApiProperty()
  @Column({ name: 'pto_mins', nullable: true })
  ptoMins: number

  @ApiProperty()
  @Column({ name: 'holiday_mins', nullable: true })
  holidayMins: number
}