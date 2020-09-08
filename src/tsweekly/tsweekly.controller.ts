import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TsweeklyService } from './tsweekly.service';
import { FilterTsweeklyDto } from './dto/filter-tsweekly.dto';
import { Tsweekly } from './tsweekly.entity';
import { CreateTsweeklyDto } from './dto/create-tsweekly.dto';
import { EmailValidationPipe } from '../pipes/email-validation.pipe';
import { UpdateTsweeklyDto } from './dto/update-tsweekly.dto';

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

  @Get(':emailId')
  getTsweeklyById(@Param('emailId') emailId): Promise<Tsweekly[]> {
    return this.tsweeklyService.getTsweeklyById(emailId);
  }

  @Post()
  createTsweekly(@Body('email', EmailValidationPipe) email,
                 @Body() createTsweeklyDto: CreateTsweeklyDto): Promise<void> {
    return this.tsweeklyService.createTsweekly(createTsweeklyDto);
  }

  // @Patch(':emailId/:weekId')
  // UpdateTsweekly(@Param('emailId') emailId, @Param('weekId') weekId, @Body() updateTsweeklyDto: UpdateTsweeklyDto) { // @Param
  //   return this.tsweeklyService.updateTsweekly(emailId, weekId, updateTsweeklyDto);
  // }
  //
  // @Patch(':emailId/:weekId/document')
  // UpdateTsweeklyDocument(@Param('emailId') emailId, @Param('weekId') weekId, @Body() updateTsweeklyDto: UpdateTsweeklyDto) { // @Param
  //   return this.tsweeklyService.updateTsweeklyDocument(emailId, weekId, updateTsweeklyDto);
  // }
}
