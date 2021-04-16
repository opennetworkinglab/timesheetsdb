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
import { User } from '../auth/user.entity';
import { Week } from '../week/week.entity';

@Entity('weeklies')
@Index(['user', 'weekId'], { unique: true })
export class Weekly extends BaseEntity {

  @ApiProperty()
  @ManyToOne(() => User, user => user.weeklies, { eager: true })
  @JoinColumn({ name: 'weekly_user_email' })
  @PrimaryColumn({ name: 'weekly_user_email', type: 'varchar' })
  user: User

  @ApiProperty()
  @ManyToOne(() => Week)
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
  @Column({ name: 'user_signed', nullable: true })
  userSigned: string

  @ApiProperty()
  @Column({ name: 'supervisor_signed', default: false})
  supervisorSigned: boolean

  @ApiProperty()
  @Column({ name: 'user_signed_date', nullable: true, type: 'timestamp'})
  userSignedDate: Date

  @ApiProperty()
  @Column({ name: 'supervisor_signed_date', nullable: true, type: 'timestamp'})
  supervisorSignedDate: Date
}
