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
