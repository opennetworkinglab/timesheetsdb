import { Body, Controller, Post, UseGuards } from '@nestjs/common';;
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('project')
@UseGuards(AuthGuard())
export class ProjectController {

  constructor(private projectService: ProjectService) {}

  @Post('createproject')
  createUser(@GetUser() user: User,
             @Body() createProjectDto:  CreateProjectDto): Promise<void> {

    return this.projectService.createProject(user, createProjectDto);
  }

}
