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

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { WeekModule } from './week/week.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
import { Week } from './week/week.entity';
import { Project } from './project/project.entity';
import { DayModule } from './day/day.module';
import { TimeModule } from './time/time.module';
import { Day } from './day/day.entity';
import { Time } from './time/time.entity';
import { WeeklyModule } from './weekly/weekly.module';
import { Weekly } from './weekly/weekly.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',// as 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'postgres'),
        password: configService.get<string>('DATABASE_PASS', 'postgres'),
        database: configService.get<string>('DATABASE_NAME', 'timesheets'),
        entities: [User, Week, Project, Day, Time, Weekly],
        // entities: [join(__dirname + '/../**/*.entity.{js,ts}')],
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    ProjectModule,
    WeekModule,
    DayModule,
    TimeModule,
    WeeklyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
