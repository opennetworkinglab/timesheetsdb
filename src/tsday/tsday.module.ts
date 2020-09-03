import { Module } from '@nestjs/common';
import { TsdayController } from './tsday.controller';
import { TsdayService } from './tsday.service';

@Module({
  controllers: [TsdayController],
  providers: [TsdayService]
})
export class TsdayModule {}
