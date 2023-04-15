import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AppService } from '../../app.service';
import { HttpRequestService } from '../http-request/http-request.service';
import { MatchService } from '../match/match.service';
import { PlayerSummaryController } from './player-summary.controller';
import { PlayerSummaryService } from './player-summary.service';
import { SummonerService } from '../summoner/summoner.service';

@Module({
  controllers: [PlayerSummaryController],
  imports: [HttpModule],
  providers: [
    AppService,
    HttpRequestService,
    MatchService,
    PlayerSummaryService,
    SummonerService
  ],
})
export class PlayerSummaryModule {}
