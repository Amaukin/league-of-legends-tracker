import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { MatchDto } from '../../entities/match.dto';
import { MatchService } from './match.service';
import { MappedMatchDto } from 'src/entities/mapped-match.dto';

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

  /**
    * @description Gets recent matches by summoner and region
    * @param {string} summonerName Summoner's name 
    * @param {string} region Summoner's region 
    * @returns {Promise<MatchDto[]>} List of recent matches
    */
   @Get('/recent-matches/:summonerName/:region/:queueId/:startValue')
   public getRecentMatchesByFilters(
     @Param('summonerName') summonerName: string,
     @Param('region') region: string,
     @Param('queueId', ParseIntPipe) queueId: number,
     @Param('startValue', ParseIntPipe) startValue: number,
   ): Promise<MatchDto[]> {
     return this.matchService.getRecentMatchesByFilters(summonerName, region, queueId, startValue);
   }

   /**
     * @description Gets recent matches by summoner and region
     * @param {string} summonerName Summoner's name 
     * @param {string} region Summoner's region 
     * @returns {Promise<MatchDto[]>} List of recent matches
     */
    @Get('/recent-matches/:summonerName/:region/:queueId/:startValue/:participant')
    public getRecentMatchesByFiltersMapped(
      @Param('summonerName') summonerName: string,
      @Param('region') region: string,
      @Param('queueId', ParseIntPipe) queueId: number,
      @Param('startValue', ParseIntPipe) startValue: number,
      @Param('participant') participant: string,
    ): Promise<MappedMatchDto[]> {
      return this.matchService.getRecentMatchesByFiltersMapped(summonerName, region, queueId, startValue, participant);
    }
}
