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

import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD:src/auth/dto/update-tsuser.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
=======
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
>>>>>>> master:src/tsuser/dto/create-user.dto.ts

export class UpdateTsUserDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
<<<<<<< HEAD:src/auth/dto/update-tsuser.dto.ts
  supervisorEmail: string
=======
  email: string;
>>>>>>> master:src/tsuser/dto/create-user.dto.ts

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
<<<<<<< HEAD:src/auth/dto/update-tsuser.dto.ts
  darpaAllocationPct: string

  @ApiProperty()
  @IsNotEmpty()
    // @IsBoolean()
  isSupervisor: boolean

  @ApiProperty()
  isActive: boolean
=======
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  supervisoremail: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  darpaallocationpct: string

  @ApiProperty()
  @IsNotEmpty()
  // @IsBoolean()
  issupervisor: boolean
>>>>>>> master:src/tsuser/dto/create-user.dto.ts
}