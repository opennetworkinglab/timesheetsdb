/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Config for database connetion.
 */
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'vrud',
  password: 'temppass',
  database: 'timesheetstest',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
}