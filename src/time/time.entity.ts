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
  Entity, JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Day } from '../day/day.entity';
import { Project } from '../project/project.entity';

@Entity('times')
export class Time extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'time_id'})
  id: number

  @ApiProperty()
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'name' })
  name: string

  @ApiProperty()
  @Column()
  minutes: number

  @ApiProperty()
  @ManyToOne(() => Day, day => day.times, { eager: false })
  @JoinColumn({ name: 'day_id' })
  days: Day[]
}