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

import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TsWeekly } from '../tsweekly/tsweekly.entity';

@Entity('tsuser')
@Unique('tsweek_fullname_uk', ['firstName', 'lastName'])
export class TsUser extends BaseEntity {

  @ApiProperty()
  @PrimaryColumn()
  email: string

  @ApiProperty()
  @Column({ name: 'firstname' })
  firstName: string

  @ApiProperty()
  @Column({ name: 'lastname' })
  lastName: string

  @ApiProperty()
  @Column({ name: 'supervisoremail' })
  supervisorEmail: string

  @ApiProperty()
  @Column({ name: 'darpaallocationpct' })
  darpaAllocationPct: string

  @ApiProperty()
  @Column({ name: 'issupervisor', default: false })
  isSupervisor: boolean

  @ApiProperty()
  @Column({ name: 'isactive', default: true })
  isActive: boolean

  @ApiProperty()
  @OneToMany(type => TsWeekly, tsWeekly => tsWeekly.tsUser, { eager: true })
  tsWeeklys: TsWeekly[]

}