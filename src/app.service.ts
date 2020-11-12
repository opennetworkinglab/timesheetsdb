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

import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from './auth/user.entity';

@Injectable()
export class AppService {

  async testPoint(): Promise<{ status }> {

    try {
      const users = await getConnection().getRepository(User).find();

      if(users.length > 0){
        return {
          status: 'DB working'
        }
      }
    }
    catch (error){
      return {
        status: 'Error with db\n' + error
      }
    }

  }
}
