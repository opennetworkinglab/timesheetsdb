import { Module } from '@nestjs/common';
import { OnfDayController } from './onf-day.controller';
import { OnfDayService } from './onf-day.service';

@Module({
  controllers: [OnfDayController],
  providers: [OnfDayService]
})
export class OnfDayModule {}
