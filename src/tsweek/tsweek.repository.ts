/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { EntityRepository, Repository } from 'typeorm';
import { Tsweek } from './tsweek.entity';
import { FilterTsweekDto } from './dto/filter-tsweek.dto';

@EntityRepository(Tsweek)
export class TsweekRepository extends Repository<Tsweek> {

  /**
   * Returns a Promise of an array of Tsweek based on filter. One to many Tsweek can be returned.
   * @param filterTsweekDto
   */
  async getTsweeks(filterTsweekDto: FilterTsweekDto): Promise<Tsweek[]> {

    const { year, weekno } = filterTsweekDto;

    const query = this.createQueryBuilder('tsweek');

    if (year) {
      query.andWhere('tsweek.year = :year', { year });
    }

    if (weekno) {
      query.andWhere('tsweek.weekno = :weekno', { weekno });
    }

    // Gets all the weeks or weeks based on filters
    return await query.getMany();
  }

  async createTsweek(): Promise<void> {

    const weekms = 168 * 60 * 60 * 1000;
    const startdate = 1588550400000; // Mon 4th may 2020
    const initweek = 18;

    // Populating tsweeks table
    for (let w = 1; w <= 34; w++) {
      const d = new Date(startdate + w * weekms);
      const tsweek = new Tsweek();
      tsweek.year = d.getFullYear();
      tsweek.weekno = initweek + w;
      tsweek.monthno = d.getMonth();
      tsweek.begin = new Date(d.getTime());
      tsweek.end = new Date(d.getTime() + weekms - 1000);
      await tsweek.save();
    }
  }
}