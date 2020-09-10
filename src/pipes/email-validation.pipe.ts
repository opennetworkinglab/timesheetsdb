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

import { BadRequestException, PipeTransform } from '@nestjs/common';

export class EmailValidationPipe implements PipeTransform{

  transform(value: string): any {

    if (!this.isValid(value)){
      throw new BadRequestException(`email ${value}is not of opennetworking domain`);
    }

    return value
  }

  private isValid (email: string){
    console.log(email);
    const validArr = email.split('@');
    console.log(validArr)
    if(validArr[1].localeCompare('opennetworking.org') === 0){
      return true;
    }
  }
}
