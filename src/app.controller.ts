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

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { auth } from './google/auth';
import { readFile } from 'fs.promises';

export const GOOGLE_TOKEN_PATH = '../token/token.json'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly configService: ConfigService) {

    this.delay(500).then( () => {

      readFile(GOOGLE_TOKEN_PATH)
        .then( () => {
          console.log("Google Token exists");
        })
        .catch( () => {

          const redirectUris = this.configService.get<string>('GOOGLE_REDIRECT_URIS').split(', ');

          const credentials = {
            "installed": {
              "client_id": this.configService.get<string>('GOOGLE_CLIENT_ID'),
              "project_id":this.configService.get<string>('GOOGLE_PROJECT_ID'),
              "auth_uri": this.configService.get<string>('GOOGLE_AUTH_URI'),
              "token_uri": this.configService.get<string>('GOOGLE_TOKEN_URI'),
              "auth_provider_x509_cert_url": this.configService.get<string>('GOOGLE_AUTH_PROVIDER_X509_CERT_URL'),
              "client_secret": this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
              "redirect_uris": redirectUris
            }
          };

          auth.generateToken(credentials);
        });
    });
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms));
  }

  @Get()
  async testPoint(): Promise<{ status }> {
    return await this.appService.testPoint();
  }
}
