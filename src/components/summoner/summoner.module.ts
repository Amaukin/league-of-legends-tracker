import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AppService } from '../../app.service';
import { HttpRequestService } from '../http-request/http-request.service';
import { SummonerController } from './summoner.controller';
import { SummonerService } from './summoner.service';

@Module({
  controllers: [SummonerController],
  imports: [HttpModule],
  providers: [
    AppService,
    HttpRequestService,
    SummonerService
  ],
})
export class SummonerModule {}
