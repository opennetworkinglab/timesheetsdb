import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DayRepository } from './day.repository';
import { User } from '../auth/user.entity';
import { Day } from './day.entity';
import { UpdateDayDto } from './dto/update-day.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class DayService {

  constructor(
    @InjectRepository(DayRepository)
    private tsDayRepository: DayRepository) {}

  async getDays(user: User, weekId: number): Promise<Day[]> {
    return this.tsDayRepository.getDays(user, weekId);
  }

  async updateDay(user: User, dayId: Date, updateDayDto: UpdateDayDto): Promise<UpdateResult> {
    return await this.tsDayRepository.updateDay(user, dayId, updateDayDto)
  }

}
