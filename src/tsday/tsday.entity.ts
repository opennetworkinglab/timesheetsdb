/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tsuser } from '../tsuser/tsuser.entity';
import { Tsweek } from '../tsweek/tsweek.entity';

@Entity('tsdays')
@Index(['email', 'day'], { unique: true })
export class Tsday extends BaseEntity {

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => Tsuser)
  @JoinColumn({ name: 'email'})
  @PrimaryColumn()
  email: string

  @ApiProperty()
  @Column()
  @PrimaryColumn()
  day: Date

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => Tsweek)
  @JoinColumn({ name: 'weekid'})
  weekid: number

  @ApiProperty()
  @Column( 'decimal', { precision: 4, scale: 2 })
  darpatime: number

  @ApiProperty()
  @Column( 'decimal', { precision: 4, scale: 2 })
  nondarpatime: number

  @ApiProperty()
  @Column( 'decimal', { precision: 4, scale: 2 })
  sick: number

  @ApiProperty()
  @Column( 'decimal', { precision: 4, scale: 2 })
  pto: number

  @ApiProperty()
  @Column( 'decimal', { precision: 4, scale: 2 })
  holiday: number
}