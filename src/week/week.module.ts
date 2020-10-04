import { Module } from '@nestjs/common';
import { WeekController } from './week.controller';
import { WeekService } from './week.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { WeekRepository } from './week.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeekRepository]),
    AuthModule
  ],
  controllers: [WeekController],
  providers: [WeekService]
})
export class WeekModule {}
