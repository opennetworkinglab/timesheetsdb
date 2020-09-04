import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TsweeklyService } from './tsweekly.service';
import { FilterTsweeklyDto } from './dto/filter-tsweekly.dto';
import { Tsweekly } from './tsweekly.entity';
import { CreateTsweeklyDto } from './dto/create-tsweekly.dto';

@Controller('tsweekly')
export class TsweeklyController {

  constructor(private tsweeklyService: TsweeklyService) {}

  /**
   * Returns a Promise of an array of Tsweekly based on filter. One to many Tsweekly can be returned.
   * @param filterTsweeklyDto
   */
  @Get()
  getTsweekly(@Query() filterTsweeklyDto: FilterTsweeklyDto): Promise<Tsweekly[]> {
    return this.tsweeklyService.getTsweekly(filterTsweeklyDto);
  }

  @Post()
  @ApiResponse({ status: 201, description: "Added" })
  createTsweekly(@Body() createTsweeklyDto: CreateTsweeklyDto): Promise<void> {
    return this.tsweeklyService.createTsweekly(createTsweeklyDto);
  }

  @Patch()
  p (@Body() createTsweeklyDto: CreateTsweeklyDto) {
    return this.tsweeklyService.createTsweekly(createTsweeklyDto);
  }
}
