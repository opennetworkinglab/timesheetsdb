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
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository) {}

  async createUser(user: User, createUserDto: CreateUserDto): Promise<void> {

    if(!user.isSupervisor || !user.isActive){
      throw new UnauthorizedException();
    }

    return this.userRepository.createUser(createUserDto);
  }

  async updateUser(user: User, emailId: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {

    if(!user.isSupervisor){
      throw new UnauthorizedException();
    }

    return this.userRepository.updateUser(user, emailId, updateUserDto);
  }

  async getUsers(user: User): Promise<User[]> {

    if(!user.isSupervisor){
      throw new UnauthorizedException();
    }

    return this.userRepository.getUsers(user);
  }

  async getSupervisor(user: User): Promise<User> {
    return this.userRepository.getSupervisor(user);
  }
}
