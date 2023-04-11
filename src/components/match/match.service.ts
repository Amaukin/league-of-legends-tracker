import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';

import { HttpRequestService } from '../http-request/http-request.service';
import { MatchDto } from '../../entities/match.dto';
import { PATH_CONSTANTS } from '../../constants/path.constants';
import { SummonerService } from '../summoner/summoner.service';

@Injectable()
export class MatchService {
  constructor(
    private httpRequestService: HttpRequestService,
    private httpService: HttpService,
    private summonerService: SummonerService,
  ) {}

  /**
   * @description Gets recent matches by summoner and region
   * @param {string} summonerName Summoner's name 
   * @param {string} region Summoner's region 
   * @returns {Promise<MatchDto[]>} List of recent matches
   */
  public async getRecentMatchesBySummonerAndRegion(summonerName: string, region: string): Promise<MatchDto[]> {
    const summoner = await this.summonerService.getSummonerByName(summonerName, region);
    const { puuid } = summoner;
    const { config : matchesConfig, url : matchesUrl } = 
      this.httpRequestService.getRiotDeveloperRequest({puuid}, PATH_CONSTANTS.RECENT_MATCHES_BY_PUUID_PATH);

    try {
      const matchesResponse = await lastValueFrom(this.httpService.get(matchesUrl, matchesConfig));
      const matches: MatchDto[] = [];
      const matchesIds: string[] = matchesResponse.data;
      for (const matchId of matchesIds) {
        const { config, url } = this.httpRequestService.getRiotDeveloperRequest({matchId}, PATH_CONSTANTS.MATCH_PATH);
        const matchResponse = await lastValueFrom(this.httpService.get(url, config));
        const match = matchResponse.data;
        matches.push(match);
      }
      return matches;
    } catch (error) {
      console.log('An error has ocurred.', error);
    }
  }
}
