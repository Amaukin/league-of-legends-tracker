import { Controller, Get } from '@nestjs/common';

import { LeaderboardDto } from '../../entities/leaderboard.dto';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private leaderboardService: LeaderboardService,
  ) {}

  /**
   * @description Gets leaderboard information of last searched summoner
   * @returns Last searched summoner leaderboard info
   */
  @Get('/current-summoner')
  public getCurrentSummonerLeaderboard(): LeaderboardDto {
    return this.leaderboardService.getCurrentSummonerLeaderboard();
  }
}
