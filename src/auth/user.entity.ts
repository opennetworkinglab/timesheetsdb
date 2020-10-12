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

import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../project/project.entity';
import { Day } from '../day/day.entity';
import { Weekly } from '../weekly/weekly.entity';

@Entity('users')
@Unique('full_name', ['firstName', 'lastName'])
export class User extends BaseEntity {

  @ApiProperty()
  @PrimaryColumn()
  email: string

  @ApiProperty()
  @Column({ name: 'first_name' })
  firstName: string

  @ApiProperty()
  @Column({ name: 'last_name' })
  lastName: string

  // TODO: MOVE supervisorEmail and darpaAllocationPct (rename to allocationPCt)
  @ApiProperty()
  @Column({ name: 'supervisor_email' })
  supervisorEmail: string

  @ApiProperty()
  @Column({ name: 'darpa_allocation_pct' })
  darpaAllocationPct: number

  @ApiProperty()
  @Column({ name: 'is_supervisor', default: false })
  isSupervisor: boolean

  @ApiProperty()
  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @ApiProperty()
  @ManyToMany(() => Project, project => project.users, { eager: true})
  @JoinTable({ name: 'user_projects' })
  projects: Project[]

  @ApiProperty()
  @OneToMany(() => Day, day => day.user, { eager: false })
  days: Day[]

  @ApiProperty()
  @OneToMany(() => Weekly, weekly => weekly.user, { eager: true })
  weeklies: Weekly[]
}