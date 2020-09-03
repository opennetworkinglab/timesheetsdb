/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { ApiProperty } from '@nestjs/swagger';

export class FilterTsweeklyDto {

  @ApiProperty()
  email: string
}