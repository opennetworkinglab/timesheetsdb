<<<<<<< HEAD
=======
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

>>>>>>> c81e48ecb1e1d81309d0ffd326497b174ddb9b72
import { Injectable } from '@nestjs/common';
import { WeekRepository } from './week.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterWeekDto } from './dto/filter-week.dto';
import { Week } from './week.entity';

@Injectable()
export class WeekService {

  constructor(
    @InjectRepository(WeekRepository)
    private weekRepository: WeekRepository) {}

  async getWeek(filterWeekDto: FilterWeekDto): Promise<Week[]> {
    return this.weekRepository.getWeeks(filterWeekDto);
  }

  async getWeekById(id: number):Promise<Week> {
    return this.weekRepository.getWeekById(id);
  }
}
