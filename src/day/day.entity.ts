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

import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../auth/user.entity';
import { Week } from '../week/week.entity';
import { Time } from '../time/time.entity';


@Entity('days')
@Unique('user_day', ['user', 'day'])
export class Day extends BaseEntity {

  @PrimaryGeneratedColumn({ name: 'day_id'})
  id: number

  @ApiProperty()
  @ManyToOne(() => User, user => user.days, { eager: true })
  @JoinColumn({ name: 'day_user_email'})
  @Column({ name: 'day_user_email', type: 'varchar' })
  user: User

  @ApiProperty()
  @Column({ type: 'date'})
  day: Date

  @ApiProperty()
  @ManyToOne(() => Week)
  @JoinColumn({ name: 'week_id' })
  @Column( { name: 'week_id' })
  weekId: number

  // TODO: Check out many to many relationship with joinTable
  @ApiProperty()
  @OneToMany(() => Time, time => time.days, { eager: true })
  @JoinColumn({
    name: "time_id"
  })
  times: Time[]
}