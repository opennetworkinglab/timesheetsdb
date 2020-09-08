/*
 * Copyright 2020-present Open Networking Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { EntityRepository, Repository } from 'typeorm';
import { Tsuser } from './tsuser.entity';
import { FilterTsuserDto } from './dto/filter-user.dto';
import { CreateTsuserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
/**
 * Returns a Promise of an array of Tsweek based on filter. One to many Tsweek can be returned.
 * @param filterTsweekDto
 */
@EntityRepository(Tsuser)
export class TsuserRepository extends Repository<Tsuser> {

  /**
   * Returns a Promise of an array of Tsuser based on filter. One to many Tsuser can be returned.
   * @param filterTsweekDto
   */
  async getTsusers(filterTsweekDto: FilterTsuserDto): Promise<Tsuser[]> {

    const { supervisoremail, darpaallocationpct } = filterTsweekDto;

    const query = this.createQueryBuilder('tsuser');

    if (supervisoremail) {
      query.andWhere('tsuser.supervisoremail = :supervisoremail', { supervisoremail });
    }

    if (darpaallocationpct) {
      query.andWhere('tsuser.darpaallocationpct = :darpaallocationpct', { darpaallocationpct });
    }

    return await query.getMany();
  }

  async getTsuserById(emailId: string):Promise<Tsuser> {

    const found =  await this.findOne({ email: emailId });

    if (!found) {
      throw new HttpException('Not in table', HttpStatus.BAD_REQUEST);
    }

    return found;
  }

  async createTsuser(createTsuserDto: CreateTsuserDto): Promise<void> {

    const { email, firstname, lastname, supervisoremail, darpaallocationpct, issupervisor } = createTsuserDto;

    const tsuser = new Tsuser();
    tsuser.email = email;
    tsuser.firstname = firstname;
    tsuser.lastname = lastname;
    tsuser.supervisoremail = supervisoremail;
    tsuser.darpaallocationpct = darpaallocationpct;
    tsuser.issupervisor = issupervisor;

    await tsuser.save();
  }
}