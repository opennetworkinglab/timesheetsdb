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

@Entity('tsweekly')
@Index(['tsUser', 'weekId'], { unique: true })
export class TsWeekly extends BaseEntity {

  @ApiProperty()
  @ManyToOne(() => TsUser, tsUser => tsUser.tsWeeklys, { eager: false })
  @JoinColumn({ name: 'ts_user_email' })
  @PrimaryColumn({ name: 'ts_user_email', type: 'varchar' })
  tsUser: TsUser

  @ApiProperty()
  @ManyToOne(() => TsWeek)
  @JoinColumn({ name: 'week_id' })
  @PrimaryColumn({ name: 'week_id' })
  weekId: number

  @ApiProperty()
  @Column({ nullable: true })
  document: string

  @ApiProperty()
  @Column({ nullable: true })
  preview: string

  @ApiProperty()
  @Column({ type: 'date', name: 'user_signed', nullable: true })
  userSigned: Date

  @ApiProperty()
  @Column({ type: 'date', name: 'admin_signed', nullable: true })
  adminSigned: Date
}