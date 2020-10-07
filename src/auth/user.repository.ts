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

import { HttpException, HttpStatus} from '@nestjs/common';
import { EntityRepository, getConnection, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Project } from '../project/project.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async createTsUser(createUserDto: CreateUserDto): Promise<void> {

    const { email, firstName, lastName, supervisorEmail, darpaAllocationPct, isSupervisor, projects } = createUserDto;

    const newUser = new User();
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.supervisorEmail = supervisorEmail;
    newUser.darpaAllocationPct = darpaAllocationPct;
    newUser.isSupervisor = isSupervisor;
    newUser.projects = [];

    const sharedProjects = await getConnection().getRepository(Project).find({ where: { priority: 1 }});

    for(let i = 0; i < sharedProjects.length; i++){

      newUser.projects.push(sharedProjects[i]);
    }

    for(let i = 0; i < projects.length; i++) {

      const getProject = await getConnection().getRepository(Project).findOne({ where: { name: projects[i] }});

      if (!getProject){
        throw new HttpException("No project with " + projects[i] + " name", HttpStatus.BAD_REQUEST);
      }

      newUser.projects.push(getProject);
    }

    await newUser.save();

    throw new HttpException("User created", HttpStatus.CREATED);
  }

  async updateUser(user: User, emailId: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {

    // eslint-disable-next-line prefer-const
    let { supervisorEmail, darpaAllocationPct, isSupervisor, isActive, projects } = updateUserDto;

    const updatedUser = await this.findOne({ where: { email: emailId } });

    if(!supervisorEmail){
      supervisorEmail = updatedUser.supervisorEmail;
    }

    if(!darpaAllocationPct){
      darpaAllocationPct = updatedUser.darpaAllocationPct;
    }

    if(!isSupervisor){
      isSupervisor = updatedUser.isSupervisor;
    }

    if(!isActive){
      isActive = updatedUser.isActive;
    }

    const updatedProjects = updatedUser.projects;

    if(projects){

      for(let i = 0; i < projects.length; i++) {

        const getProject = await getConnection().getRepository(Project).findOne({ where: { name: projects[i] }});

        if (!getProject){
          throw new HttpException("No project with " + projects[i] + " name", HttpStatus.BAD_REQUEST);
        }

        updatedProjects.push(getProject);
      }
    }

    return await this.update(
      { email: emailId },
      {
        supervisorEmail: supervisorEmail,
        darpaAllocationPct: darpaAllocationPct,
        isSupervisor: isSupervisor,
        isActive: isActive,
        projects: updatedProjects
    });
  }

  async getUsers(user: User): Promise<User[]> {

    return this.find({
      where: { supervisorEmail: user.email },
      relations: ['projects']
    })
  }

  // TODO: DELETE FOR PRODUCTION
  async tempSignIn(email: string): Promise<string> {

    const user = await this.findOne({
      select: ['email'],
      where: { email: email}
    });

    return user.email;
  }
}