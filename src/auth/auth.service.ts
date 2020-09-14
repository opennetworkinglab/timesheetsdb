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

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TsUserRepository } from './tsuser.repository';
import { CreateTsUserDto } from './dto/create-tsuser.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { TsUser } from './tsuser.entity';
import { UpdateResult } from 'typeorm';
import { UpdateTsUserDto } from './dto/update-tsuser.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(TsUserRepository)
    private tsUserRepository: TsUserRepository,
    private jwtService: JwtService) {}

  async createTsUser(tsUser: TsUser, createTsUserDto: CreateTsUserDto): Promise<void> {

    if(!tsUser.isSupervisor){
      throw new UnauthorizedException();
    }

    return this.tsUserRepository.createTsUser(tsUser, createTsUserDto);
  }

  async updateTsUser(tsUser: TsUser, emailId: string, updateTsUserDto: UpdateTsUserDto): Promise<UpdateResult> {
    return this.tsUserRepository.updateTsUser(tsUser, emailId, updateTsUserDto);
  }

  async getTsUsers(tsUser: TsUser): Promise<TsUser[]> {
    return this.tsUserRepository.getTsusers(tsUser);
  }

  // TEMP
  async tempSignUp(createTsUserDto: CreateTsUserDto): Promise<void> {
    return this.tsUserRepository.tempCreateTsUser(createTsUserDto);
  }

  // TEMP
  async tempSignIn(email: string): Promise<{ accessToken: string }> {

    const emailString = this.tsUserRepository.tempSignIn(email);

    if(!emailString) {
      throw new UnauthorizedException("Invalid");
    }

    const payload: JwtPayloadInterface = { email };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

}
