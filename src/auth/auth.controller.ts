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
import { EmailValidationPipe } from './pipes/email-validation.pipe';
import { CreateTsUserDto } from './dto/create-tsuser.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetTsUser } from './get-tsuser.decorator';
import { TsUser } from './tsuser.entity';
import { UpdateResult } from 'typeorm';
import { UpdateTsUserDto } from './dto/update-tsuser.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('createuser')
  @UseGuards(AuthGuard())
  createTsUser(@GetTsUser() tsUser: TsUser,
               @Body('email', EmailValidationPipe)
               @Body() createTsuserDto:  CreateTsUserDto): Promise<void> {

    return this.authService.createTsUser(tsUser, createTsuserDto);
  }

  @Post('tempcreateuser') // TEMP
  tempCreateTsUser(@Body() createTsuserDto:  CreateTsUserDto): Promise<void> {
    return this.authService.tempSignUp(createTsuserDto);
  }

  @Post('tempsignin') // TEMP
  tempSignIn(@Body('email') email): Promise<{ accessToken: string}> {
    return this.authService.tempSignIn(email);
  }

  @Patch(':emailId')
  @UseGuards(AuthGuard())
  updateTsUser(@GetTsUser() tsUser: TsUser,
               @Param('emailId') emailId,
               @Body() updateTsUserDto: UpdateTsUserDto): Promise<UpdateResult> {
    return this.authService.updateTsUser(tsUser, emailId, updateTsUserDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  getTsUser(@GetTsUser() tsUser: TsUser): Promise<TsUser[]> {
    return this.authService.getTsUsers(tsUser);
  }
}
