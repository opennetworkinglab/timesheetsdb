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

import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WeeklyService } from './weekly.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Weekly } from './weekly.entity';
import { UpdateWeeklyDto } from './dto/update-weekly.dto';

@Controller('weekly')
export class WeeklyController {

  constructor(private weeklyService: WeeklyService) {
  }

  @Get('reject/weeks')
  @UseGuards(AuthGuard())
  getRejectWeeks(@GetUser() user: User){
    return this.weeklyService.getRejectWeeks(user);
  }

  @Get('usersweekly/:weekId')
  @UseGuards(AuthGuard())
  getUsersAndWeekly(@Param('weekId') weekId): Promise<any> {
    return this.weeklyService.getUsersAndWeekly(weekId);
  }

  @Get('user/summary') // monthly
  summaryReport(){
    return this.weeklyService.summaryReport();
  }

  @Get('user/reminders') // sunday
  userReminderEmails () {
    return this.weeklyService.userReminderEmails();
  }

  @Post('reminders/:emailId/:weekId')
  @UseGuards(AuthGuard())
  sendReminderEmail(@GetUser() user: User,
                    @Param('weekId') weekId,
                    @Param('emailId') emailId) {
    return this.weeklyService.sendReminderEmail(user, emailId, weekId);
  }

  @Get('supervisor/update') // 10 mins
  UpdateWeeklySupervisor() {
    return this.weeklyService.updateWeeklySupervisor();
  }

  @Post('approver/sign/:emailId/:weekId')
  @UseGuards(AuthGuard())
  signWeeklyApprover(@GetUser() user: User,
                     @Param('weekId') weekId,
                     @Param('emailId') submitterEmail){
    return this.weeklyService.signWeeklyApprover(user, submitterEmail, weekId);
  }

  @Post('approver/unsign/:emailId/:weekId')
  @UseGuards(AuthGuard())
  unsignWeeklyApprover(@GetUser() user: User,
                       @Param('weekId') weekId,
                       @Param('emailId') submitterEmail){
    return this.weeklyService.unsignWeeklyApprover(submitterEmail, weekId);
  }

  @Get('unsigned')
  @UseGuards(AuthGuard())
  getLastUnsignedWeeklyDiff(@GetUser() user: User): Promise<{ diff }> {
    return this.weeklyService.getLastUnsignedWeeklyDiff(user);
  }

  @Get(':emailId/:weekId')
  @UseGuards(AuthGuard())
  getWeekly(@Param('emailId') emailId,
            @Param('weekId') weekId): Promise<Weekly> {
    return this.weeklyService.getWeekly(emailId, weekId);
  }

  @Patch(':emailId/:weekId')
  @UseGuards(AuthGuard())
  UpdateWeeklyUser(@GetUser() user: User,
                   @Param('weekId') weekId,
                   @Body() updateWeeklyDto: UpdateWeeklyDto,
                   @Body('redirectUrl') redirectUrl: string): Promise< any> {
    return this.weeklyService.updateWeeklyUser(user, weekId, updateWeeklyDto);
  }

  @Post('reject/:emailId/:weekId')
  @UseGuards(AuthGuard())
  rejectUsersWeekly(@GetUser() user: User,
                    @Param('emailId') emailId,
                    @Param('weekId') weekId,
                    @Body('comment') comment) {
    return this.weeklyService.rejectUsersWeekly(user, emailId, weekId, comment)
  }
}
