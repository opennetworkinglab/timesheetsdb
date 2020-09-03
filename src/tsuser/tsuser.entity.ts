/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tsweekly } from '../tsweekly/tsweekly.entity';

@Entity('tsusers')
@Unique('tsweek_fullname_uk', ['firstname', 'lastname'])
export class Tsuser extends BaseEntity {

  @ApiProperty()
  @PrimaryColumn()
  email: string

  @ApiProperty()
  @Column({ name: 'firstname' })
  firstname: string

  @ApiProperty()
  @Column({ name: 'lastname' })
  lastname: string
}