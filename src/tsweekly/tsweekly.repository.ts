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

import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { Tsweekly } from './tsweekly.entity';
import { FilterTsweeklyDto } from './dto/filter-tsweekly.dto';
import { CreateTsweeklyDto } from './dto/create-tsweekly.dto';

import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateTsweeklyDto } from './dto/update-tsweekly.dto';

@EntityRepository(Tsweekly)
export class TsweeklyRepository extends Repository<Tsweekly> {

  /**
   * Returns a Promise of an array of Tsweekly based on filter. One to many Tsweekly can be returned.
   * @param filterTsweeklyDto
   */
  async getTsweekly(filterTsweeklyDto: FilterTsweeklyDto): Promise<Tsweekly[]> {

    const { email } = filterTsweeklyDto;

    const query = this.createQueryBuilder('tsweekly');

    if (email) {
      query.andWhere('tsweekly.email = :email', { email });
    }

    // Go through and convert blob
    // blobToFile ( ... );

    return await query.getMany();
  }

  async getTsweeklyById(emailId: string): Promise<Tsweekly[]> {

    const found = await this.find({ email: emailId });

    if (!found) {
      throw new HttpException('Not in table', HttpStatus.BAD_REQUEST);
    }

    return found;
  }

  async createTsweekly(createTsweeklyDto : CreateTsweeklyDto): Promise<void> {

    const { email, weekid, document, preview } = createTsweeklyDto;

    try {

      const tsweekly = new Tsweekly();
      tsweekly.email = email;
      tsweekly.weekid = weekid;
      tsweekly.document = document;
      tsweekly.preview = preview;
      // tsweekly.userSigned = new Date();
      // tsweekly.adminSigned = new Date();
      await tsweekly.save();

    }catch (err) {
      throw new HttpException(err.code, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTsweeklyUser(emailId: string, weekId: number, updateTsweeklyDto: UpdateTsweeklyDto): Promise<UpdateResult> {

    const { document, preview, userSigned } = updateTsweeklyDto;

    return await this.update({
      email: emailId,
      weekid: weekId
    }, {
      document: document,
      preview: preview,
      userSigned: userSigned
    });
  }

  async updateTsweeklyAdmin(emailId: string, weekId: number, updateTsweeklyDto: UpdateTsweeklyDto) {

    const { adminSigned } = updateTsweeklyDto;

    return await this.update({
      email: emailId,
      weekid: weekId
    },{
      adminSigned: adminSigned
    });
  }
}