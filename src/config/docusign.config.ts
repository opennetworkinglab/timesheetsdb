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




// IGNORE FILE
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocusignConfigService {

  constructor(private configService: ConfigService) {
  }

  getPayload(){

    // return  {
    //   "iss": this.configService.get<string>('ISS'),
    //   "sub": this.configService.get<string>('SUB'),
    //   "name": this.configService.get<string>('NAME'),
    //   "aud": this.configService.get<string>('AUD'),
    //   "iat": Math.floor(new Date().getTime() / 1000),
    //   "exp": Math.floor((new Date().getTime() + 1000000) / 1000),
    //   "scope": this.configService.get<string>('SCOPE')
    // }
  }
}

export const basePath = "https://demo.docusign.net/restapi";
export const accountId = "8bd1f442-916a-4872-9323-2ab3934a7438";
export const payload = {
  "iss": "3c34df0a-524c-42e8-8e73-c0405f97b624",
  "sub": "62f55a15-8406-47b7-9218-9e1ba25cf70c",
  "name": "pol1 lop1",
  "aud": "account-d.docusign.com",
  "iat": Math.floor(new Date().getTime() / 1000),
  "exp": Math.floor((new Date().getTime() + 1000000) / 1000),
  "scope": "signature impersonation"
}