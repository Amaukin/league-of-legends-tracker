import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

@Module({
  controllers: [LeaderboardController],
  imports: [HttpModule],
  providers: [
    LeaderboardService,
  ],
})
export class LeaderboardModule {}
