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
import { EntityRepository, Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

const sharedProjectsName = ['Darpa HR001120C0107','Sick', 'Holiday', 'PTO', 'G_A', 'IR_D']
const sharedProjectsPriority = 1;

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {

  constructor() {
    super();

    // this.createSharedProjects().then(() => {
    //   console.log("Projects created: " + sharedProjectsName);
    // }).catch(()=> {
    //   console.log("Projects already created: " + sharedProjectsName);
    // });
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<void> {

    const { name, priority } = createProjectDto

    const newProject = new Project();
    newProject.name = name;
    newProject.priority = priority;
    await newProject.save();

    throw new HttpException("Project created", HttpStatus.CREATED);
  }

  async createSharedProjects() {

    for (let i = 0; i < sharedProjectsName.length; i++){

      const newProject = new Project();
      newProject.name = sharedProjectsName[i];
      newProject.priority = sharedProjectsPriority;
      await newProject.save();
    }

  }
}
