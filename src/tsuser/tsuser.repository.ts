/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import { EntityRepository, Repository } from 'typeorm';
import { Tsuser } from './tsuser.entity';
import { FilterTsuserDto } from './dto/filter-user.dto';
import { CreateTsuserDto } from './dto/create-user.dto';

@EntityRepository(Tsuser)
export class TsuserRepository extends Repository<Tsuser> {

  async getUser(filterTsweekDto: FilterTsuserDto): Promise<Tsuser[]> {

    const { email, firstname, lastname } = filterTsweekDto;

    const query = this.createQueryBuilder('tsuser');

    if (email) {
      query.andWhere('tsuser.email = :email', { email });
    }

    if (firstname) {
      query.andWhere('tsuser.firstname = :firstname', { firstname });
    }

    if (lastname) {
      query.andWhere('tsuser.lastname = :lastname', { lastname });
    }

    // Gets all the weeks
    const tsusers = await query.getMany();
    return tsusers;
  }

  async createUser(createTsuserDto: CreateTsuserDto): Promise<Tsuser> {

    const { email, firstname, lastname } = createTsuserDto;

    const tsuser = new Tsuser();
    tsuser.email = email;
    tsuser.firstname = firstname;
    tsuser.lastname = lastname;

    await tsuser.save();

    return tsuser;
  }


}