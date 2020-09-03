import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TsweeklyRepository } from './tsweekly.repository';
import { FilterTsweeklyDto } from './dto/filter-tsweekly.dto';
import { Tsweekly } from './tsweekly.entity';
import { CreateTsweeklyDto } from './dto/create-tsweekly.dto';

@Injectable()
export class TsweeklyService {

  constructor(
    @InjectRepository(TsweeklyRepository)
    private tsweeklyRepository: TsweeklyRepository) {}

  async getTsweekly(filterTsweeklyDto: FilterTsweeklyDto): Promise<Tsweekly[]> {
    return this.tsweeklyRepository.getWeeks(filterTsweeklyDto);
  }

  async createTsweekly(createTsweeklyDto: CreateTsweeklyDto): Promise<void> {
    return this.tsweeklyRepository.createWeekly(createTsweeklyDto);
  }
}
