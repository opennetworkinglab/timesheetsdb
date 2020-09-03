/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { ApiProperty } from '@nestjs/swagger';
import { Tsuser } from '../../tsuser/tsuser.entity';

export class CreateTsweeklyDto {

  @ApiProperty()
  email: string

  @ApiProperty()
  weekid: number

  @ApiProperty()
  document: string

  @ApiProperty()
  preview: string

  @ApiProperty()
  userSigned: Date

  @ApiProperty()
  adminSigned: Date
}
