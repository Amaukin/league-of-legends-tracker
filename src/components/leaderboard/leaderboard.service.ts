import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

import { LeaderboardDto } from '../../entities/leaderboard.dto';

@Injectable()
export class LeaderboardService {
  private leaderboardData: LeaderboardDto;
  constructor(
    private eventEmitter: EventEmitter2,
  ) {
    this.eventEmitter.on('leaderboardDataUpdated', (leaderboardData) => this.leaderboardData = leaderboardData);
  }

  /**
   * @description Gets leaderboard information of last searched summoner
   * @returns Last searched summoner leaderboard info
   */
  public getCurrentSummonerLeaderboard(): LeaderboardDto {
    return this.leaderboardData;
  }
}
