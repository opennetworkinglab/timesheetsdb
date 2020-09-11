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

@Entity('tsdays')
@Index(['email', 'day'], { unique: true })
export class TsDay extends BaseEntity {

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => TsUser)
  @JoinColumn({ name: 'email'})
  @PrimaryColumn()
  email: string

  @ApiProperty()
  @PrimaryColumn()
  day: Date

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => TsWeek)
  @JoinColumn({ name: 'weekid' })
  @Column( { name: 'weekid' })
  weekId: number


  @ApiProperty()
  @Column({ name: 'darpamins' })
  darpaMins: number

  @ApiProperty()
  @Column({ name: 'nondarpamins' })
  nonDarpaMins: number

  @ApiProperty()
  @Column({ name: 'sickmins' })
  sickMins: number

  @ApiProperty()
  @Column({ name: 'ptomins' })
  ptoMins: number

  @ApiProperty()
  @Column({ name: 'holidaymins' })
  holidayMins: number
}