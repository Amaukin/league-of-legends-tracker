import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AppService } from '../../app.service';
import { HttpRequestService } from '../http-request/http-request.service';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PlayerSummaryService } from '../player-summary/player-summary.service';
import { SummonerService } from '../summoner/summoner.service';

@Module({
  controllers: [MatchController],
  imports: [HttpModule],
  providers: [
    AppService,
    HttpRequestService,
    MatchService,
    PlayerSummaryService,
    SummonerService,
  ],
})
export class MatchModule {}
