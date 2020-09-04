/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tsuser } from '../tsuser/tsuser.entity';
import { Tsweek } from '../tsweek/tsweek.entity';

@Entity()
@Index(['email', 'weekid'], { unique: true })
export class Tsweekly extends BaseEntity {

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => Tsuser)
  @JoinColumn({ name: 'email'})
  @PrimaryColumn()
  email: string

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => Tsweek)
  @JoinColumn({ name: 'weekid'})
  @PrimaryColumn()
  weekid: number

  @ApiProperty()
  @Column()
  document: string

  @ApiProperty()
  @Column()
  preview: string

  @ApiProperty()
  @Column()
  userSigned: Date

  @ApiProperty()
  @Column()
  adminSigned: Date
}