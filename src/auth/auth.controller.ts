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

import { Body, Controller, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateResult } from 'typeorm';
import { EmailValidationPipe } from './pipes/email-validation.pipe';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { gDriveAuth } from '../gdrive/gdrive-auth';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService,
              private configService: ConfigService) {}

  @Post('createuser')
  @UseGuards(AuthGuard())
  createUser(@GetUser() user: User,
             @Body('email', EmailValidationPipe) email,
             @Body() createUserDto:  CreateUserDto): Promise<void> {

    return this.authService.createUser(user, createUserDto);
  }

  @Post('tempcreateuser') // TODO: TEMP USER CREATE. DELETE FRO PRODUCTION
  tempCreateUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.TEMPcreateUser(createUserDto);
  }

  @Post('tempsignin') // TODO: TEMP USER SIGNIN. DELETE FRO PRODUCTION
  tempSignIn(@Body('email') email): Promise<{ accessToken: string}> {
    return this.authService.tempSignIn(email);
  }

  @Patch(':emailId')
  @UseGuards(AuthGuard())
  updateUser(@GetUser() tsUser: User,
               @Param('emailId') emailId,
               @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.authService.updateUser(tsUser, emailId, updateUserDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  getUsers(@GetUser() user: User): Promise<User[]> {
    return this.authService.getUsers(user);
  }

  @Get('google/auth/token')
  @UseGuards(AuthGuard())
  generateGoogleAuthToken(@GetUser() user: User){

    if(!user.isSupervisor){
      throw new UnauthorizedException("Not authorized");
    }

    const redirectUris = this.configService.get<string>('GOOGLE_REDIRECT_URIS').split(', ');

    const credentials= {
      "installed": {
        "client_id": this.configService.get<string>('GOOGLE_CLIENT_ID'),
        "project_id": this.configService.get<string>('GOOGLE_PROJECT_ID'),
        "auth_uri": this.configService.get<string>('GOOGLE_AUTH_URI'),
        "token_uri": this.configService.get<string>('GOOGLE_TOKEN_URI'),
        "auth_provider_x509_cert_url": this.configService.get<string>('GOOGLE_AUTH_PROVIDER_X509_CERT_URL'),
        "client_secret": this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        "redirect_uris": redirectUris
      }
    }

    gDriveAuth.generateToken(credentials);
  }
}
