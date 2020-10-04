import { Module } from '@nestjs/common';
import { WeeklyController } from './weekly.controller';
import { WeeklyService } from './weekly.service';
import { WeeklyRepository } from './weekly.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeeklyRepository]),
    AuthModule,
  ],
  controllers: [WeeklyController],
  providers: [WeeklyService]
})
export class WeeklyModule {}
