import { Module } from '@nestjs/common';
import { DayController } from './day.controller';
import { DayService } from './day.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DayRepository } from './day.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DayRepository]),
    AuthModule
  ],
  controllers: [DayController],
  providers: [DayService]
})
export class DayModule {}
