import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { PlayerSummary } from '../../types/player-summary.interface';
import { PlayerSummaryService } from './player-summary.service';

@Controller('player-summary')
export class PlayerSummaryController {
  constructor(
    private playerSummaryService: PlayerSummaryService,
  ) {}
  
  /**
   * @description Gets player summary filtered by queue
   * @param {string} summonerName Summoner's name 
   * @param {string} region Summoner's region 
   * @param {number} queueId Queue to filter by 
   * @returns {Promise<PlayerSummary>} Player collected data
   */
  @Get('/:summonerName/:region/:queueId')
  public getPlayerSummary(
    @Param('summonerName') summonerName: string,
    @Param('region') region: string,
    @Param('queueId', ParseIntPipe) queueId: number
    ): Promise<PlayerSummary> {
    return this.playerSummaryService.getPlayerSummary(summonerName, region, queueId);
  }

}
