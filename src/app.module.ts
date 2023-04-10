import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpRequestModule } from './components/http-request/http-request.module';
import { LeaderboardModule } from './components/leaderboard/leaderboard.module';
import { MatchModule } from './components/match/match.module';
import { PlayerSummaryModule } from './components/player-summary/player-summary.module';
import { SummonerModule } from './components/summoner/summoner.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpRequestModule,
    LeaderboardModule,
    MatchModule,
    SummonerModule,
    PlayerSummaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
