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
