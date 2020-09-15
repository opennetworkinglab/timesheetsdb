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
import { TsUser } from './tsuser.entity';
import { CreateTsUserDto } from './dto/create-tsuser.dto';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UpdateTsUserDto } from './dto/update-tsuser.dto';

@EntityRepository(TsUser)
export class TsUserRepository extends Repository<TsUser> {

  async createTsUser(tsUser: TsUser, createTsUserDto: CreateTsUserDto): Promise<void> {

    const { email, firstName, lastName, supervisorEmail, darpaAllocationPct, isSupervisor } = createTsUserDto;

    const newTsUser = new TsUser();
    newTsUser.email = email;
    newTsUser.firstName = firstName;
    newTsUser.lastName = lastName;
    newTsUser.supervisorEmail = supervisorEmail;
    newTsUser.darpaAllocationPct = darpaAllocationPct;
    newTsUser.isSupervisor = isSupervisor;

    await newTsUser.save();
  }

  async updateTsUser(tsUser: TsUser, emailId: string, updateTsUserDto: UpdateTsUserDto): Promise<UpdateResult> {

    if(!tsUser.isSupervisor){
      throw new UnauthorizedException();
    }

    let { supervisorEmail, darpaAllocationPct, isSupervisor, isActive } = updateTsUserDto;

    const updatedTsUser = await this.findOne({ where: { email: emailId } });


    if(!supervisorEmail){
      supervisorEmail = updatedTsUser.supervisorEmail;
    }

    if(!darpaAllocationPct){
      darpaAllocationPct = updatedTsUser.darpaAllocationPct;
    }

    if(!isSupervisor){
      isSupervisor = updatedTsUser.isSupervisor;
    }

    if(isActive){
      isActive = updatedTsUser.isActive;
    }

    return await this.update(
      { email: emailId },
      {
        supervisorEmail: supervisorEmail,
        darpaAllocationPct: darpaAllocationPct,
        isSupervisor: isSupervisor,
        isActive: isActive
    });
  }

  async tempCreateTsUser(createTsUserDto: CreateTsUserDto): Promise<void> {

    const { email, firstName, lastName, supervisorEmail, darpaAllocationPct, isSupervisor } = createTsUserDto;

    let isSupervisorB;

    try{
      isSupervisorB = Boolean(isSupervisor);

    }
    catch (err) {
      throw new HttpException(err.code, HttpStatus.BAD_REQUEST);
    }

    const newTsUser = new TsUser();
    newTsUser.email = email;
    newTsUser.firstName = firstName;
    newTsUser.lastName = lastName;
    newTsUser.supervisorEmail = supervisorEmail;
    newTsUser.darpaAllocationPct = darpaAllocationPct;
    newTsUser.isSupervisor = isSupervisorB;

    await newTsUser.save();
  }

  async tempSignIn(email: string): Promise<string> {

    const user = await this.findOne({
      select: ['email'],
      where: { email: email}
    });

    return user.email;
  }

  async getTsUsers(tsUser: TsUser): Promise<TsUser[]> {

    if(!tsUser.isSupervisor){
      throw new UnauthorizedException();
    }

    return this.find({
      select: ['email', 'firstName', 'lastName', 'isSupervisor', 'isActive'],
      where: { supervisorEmail: tsUser.email }
    })
  }
}