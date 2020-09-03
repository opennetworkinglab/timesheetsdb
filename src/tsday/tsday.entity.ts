/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tsuser } from '../tsuser/tsuser.entity';
import { Tsweek } from '../tsweek/tsweek.entity';

@Entity('tsdays')
export class Tday extends BaseEntity {

  @ApiProperty()
  @ManyToOne(type => Tsuser)
  @JoinColumn({ name: 'email'})
  @PrimaryColumn()
  email: string

  @ApiProperty()
  @OneToOne(type => Tsweek)
  @JoinColumn({ name: 'weekid'})
  @PrimaryColumn()
  weekid: number

  @ApiProperty()
  @Column({ name: 'lname' })
  day: Date


}