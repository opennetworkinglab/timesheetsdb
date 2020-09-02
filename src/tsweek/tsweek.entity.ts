/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tsweeks') // Database table name
@Unique('tsweek_year_week_uk', ['year', 'weekno'])
@Unique('tsweek_begin_uk', ['begin'])
@Unique('tsweek_end_uk', ['end'])
export class Tsweek extends BaseEntity {

  @ApiProperty()
  @Column({ name: 'year' })
  @PrimaryColumn()
  year: number

  @ApiProperty()
  @Column({ name: 'weekno' })
  @PrimaryColumn()
  weekno: number

  @ApiProperty()
  @Column({ name: 'monthno' })
  monthno: number

  @ApiProperty()
  @Column({ name: 'begin' })
  begin: Date

  @ApiProperty()
  @Column({ name: 'end' })
  end: Date
}