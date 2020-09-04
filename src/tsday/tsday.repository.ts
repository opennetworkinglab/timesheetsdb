/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { EntityRepository, Repository } from 'typeorm';
import { Tsday } from './tsday.entity';
import { CreateTsdayDto } from './dto/create-tsday.dto';
import { FilterTsdayDto } from './dto/filter-tsday.dto';

@EntityRepository(Tsday)
export class TsdayRepository extends Repository<Tsday> {

  /**
   * Returns a Promise of an array of Tsday based on filter. One to many Tsday can be returned.
   * @param filterTsdayDto
   */
  async getTsdays(filterTsdayDto: FilterTsdayDto): Promise<Tsday[]> {

    const { email, day, weekid, darpatime, nondarpatime, sick, pto, holiday } = filterTsdayDto;

    const query = this.createQueryBuilder('tsday');

    if (email) {
      query.andWhere('tsday.email = :email', { email });
    }

    if (day) {
      query.andWhere('tsday.day = :day', { day });
    }

    if (weekid) {
      query.andWhere('tsday.weekid = :weekid', { weekid });
    }

    if (darpatime) {
      query.andWhere('tsday.darpatime = :darpatime', { darpatime });
    }

    if (nondarpatime) {
      query.andWhere('tsday.nondarpatime = :nondarpatime', { nondarpatime });
    }

    if (sick) {
      query.andWhere('tsday.sick = :sick', { sick });
    }

    if (pto) {
      query.andWhere('tsday.pto = :pto', { pto });
    }

    if (holiday) {
      query.andWhere('tsday.holiday = :holiday', { holiday });
    }

    return await query.getMany();
  }

  async createTsday(createTsdayDto: CreateTsdayDto): Promise<void> {

    const { email, day, weekid, darpatime, nondarpatime, sick, pto, holiday } = createTsdayDto;

    const tsday = new Tsday();
    tsday.email = email
    tsday.day = new Date(); // will be day
    tsday.weekid = weekid;
    tsday.darpatime = darpatime;
    tsday.nondarpatime = nondarpatime;
    tsday.sick = sick;
    tsday.pto = pto;
    tsday.holiday = holiday;

    await tsday.save();
  }
}