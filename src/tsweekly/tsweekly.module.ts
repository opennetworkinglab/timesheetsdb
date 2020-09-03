import { Module } from '@nestjs/common';
import { TsweeklyController } from './tsweekly.controller';
import { TsweeklyService } from './tsweekly.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TsweeklyRepository } from './tsweekly.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TsweeklyRepository])
  ],
  controllers: [TsweeklyController],
  providers: [TsweeklyService]
})
export class TsweeklyModule {}
