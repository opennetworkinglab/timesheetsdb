/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { ApiProperty } from '@nestjs/swagger';

export class CreateTsweekDto {

  @ApiProperty()
  year: number

  @ApiProperty()
  weekno: number

  @ApiProperty()
  monthno: number

  @ApiProperty()
  begin: number

  @ApiProperty()
  end: number
}
