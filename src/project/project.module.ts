import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProjectRepository } from './project.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectRepository]),
    AuthModule
  ],
  providers: [ProjectService],
  controllers: [ProjectController]
})
export class ProjectModule {}
