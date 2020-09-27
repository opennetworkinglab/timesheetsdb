import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {

  constructor(private configService: ConfigService) {
  }

  public getDatabaseUsername() {
    console.log(this.configService.get<string>('DATABASE_USER'));
  }
}