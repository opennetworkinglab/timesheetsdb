import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { DayService } from './day.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Day } from './day.entity';
import { UpdateDayDto } from './dto/update-day.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('day')
@UseGuards(AuthGuard())
export class DayController {

  constructor(private dayService: DayService) {}

  @Get(':emailId/:weekId')
  getDays(@GetUser() user: User,
            @Param('weekId') weekId): Promise<Day[]> {
    return this.dayService.getDays(user, weekId);
  }

  @Patch(':emailId/:dayId')
  async updateDay(@GetUser() user: User,
                    @Param('dayId') dayId: Date,
                    @Body() updateDayDto: UpdateDayDto ): Promise<UpdateResult> {
    return this.dayService.updateDay(user, dayId, updateDayDto);
  }

}
