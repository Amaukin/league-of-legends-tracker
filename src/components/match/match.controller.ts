import { Controller, Get, Param } from '@nestjs/common';

import { MatchDto } from '../../entities/match.dto';
import { MatchService } from './match.service';

@Controller('matches')
export class MatchController {
  constructor(
    private matchService: MatchService,
  ) {}

 /**
   * @description Gets recent matches by summoner and region
   * @param {string} summonerName Summoner's name 
   * @param {string} region Summoner's region 
   * @returns {Promise<MatchDto[]>} List of recent matches
   */
  @Get('/recent-matches/:summonerName/:region')
  public getRecentMatchesBySummonerAndRegion(
    @Param('summonerName') summonerName: string,
    @Param('region') region: string
  ): Promise<MatchDto[]> {
    return this.matchService.getRecentMatchesBySummonerAndRegion(summonerName, region);
  }
}
