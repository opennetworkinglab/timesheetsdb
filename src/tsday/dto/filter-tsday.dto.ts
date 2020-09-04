/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { ApiProperty } from '@nestjs/swagger';

export class FilterTsdayDto {

  @ApiProperty()
  email: string

  @ApiProperty()
  day: Date

  @ApiProperty()
  weekid: number

  @ApiProperty()
  darpatime: number

  @ApiProperty()
  nondarpatime: number

  @ApiProperty()
  sick: number

  @ApiProperty()
  pto: number

  @ApiProperty()
  holiday: number
}