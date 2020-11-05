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

import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Week } from '../week/week.entity';

@Entity('onf_days')
export class OnfDay extends BaseEntity {

  @ApiProperty()
  @PrimaryColumn({ type: 'date' })
  date: Date;

  @ApiProperty()
  @ManyToOne(() => Week, week => week.onfDays, { eager: false })
  week: Week;
}
