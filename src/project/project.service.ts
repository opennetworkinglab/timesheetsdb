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
import { ProjectRepository } from './project.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository) {}

  async createProject(user: User, createProjectDto: CreateProjectDto): Promise<void> {

    if(!user.isSupervisor){
      throw new UnauthorizedException();
    }

    return this.projectRepository.createProject(createProjectDto);
  }

}
