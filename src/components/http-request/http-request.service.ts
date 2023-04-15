import { Injectable } from '@nestjs/common';

import { AxiosRequestConfig } from 'axios';

import { AppService } from '../../app.service';
import { PATH_CONSTANTS } from '../../constants/path.constants';
import { RiotDeveloperConfig } from '../../types/riot-developer-config.interface';
import { RiotDeveloperParams } from '../../types/riot-developer-params.interface';
import { RiotDeveloperRequest } from '../../types/riot-developer-request.interface';

@Injectable()
export class HttpRequestService {
  private riotDeveloperConfig: RiotDeveloperConfig;
  constructor(
    private appService: AppService,
  ) {
    this.riotDeveloperConfig = this.appService.getRiotDeveloperConfig();
  }
    
  /**
   * @description Builds configuration for riot developer request
   * @param summonerName SummonerDto's name
   * @param region SummonerDto's region
   * @param path Riot Developer path
   * @returns {RiotDeveloperRequest} Built configuration and url
   */
  public getRiotDeveloperRequest(riotDeveloperParams: RiotDeveloperParams, path: string): RiotDeveloperRequest {
    let url = PATH_CONSTANTS.HTTPS;
    switch(path) {
      case PATH_CONSTANTS.LEAGUE_BY_ID:
        url += riotDeveloperParams.region + this.riotDeveloperConfig.baseUrl;
        url += path + riotDeveloperParams.leagueId;
        break;
      case PATH_CONSTANTS.LEAGUE_ENTRY_BY_ID:
        url += riotDeveloperParams.region + this.riotDeveloperConfig.baseUrl;
        url += path + riotDeveloperParams.id;
        break;
      case PATH_CONSTANTS.MATCH_PATH:
        url += PATH_CONSTANTS.AMERICAS + this.riotDeveloperConfig.baseUrl;
        url +=  path + riotDeveloperParams.matchId;
        break;
      case PATH_CONSTANTS.RECENT_MATCHES_BY_PUUID_PATH:
        url += PATH_CONSTANTS.AMERICAS + this.riotDeveloperConfig.baseUrl;
        url += path + riotDeveloperParams.puuid + PATH_CONSTANTS.IDS + this.getStartCountParams(riotDeveloperParams);
        break;
      case PATH_CONSTANTS.SUMMONER_BY_NAME_PATH:
        url += riotDeveloperParams.region + this.riotDeveloperConfig.baseUrl;
        url += path + riotDeveloperParams.summonerName;
        break;
      default:
        break;
    }
    const apiKey = this.riotDeveloperConfig.apiKey;

    const config: AxiosRequestConfig = {
      headers: { 'X-Riot-Token': apiKey }
    };

    return {config, url}
  }

  /**
   * @description Gets start count params or uses default ones
   * @param {RiotDeveloperParams} riotDeveloperParams Request params
   * @returns {string} Start and count params
   */
  private getStartCountParams(riotDeveloperParams: RiotDeveloperParams): string {
    return riotDeveloperParams.countParam && riotDeveloperParams.startParam ?
      PATH_CONSTANTS.START_PARAM + riotDeveloperParams.startParam + PATH_CONSTANTS.COUNT_PARAM + riotDeveloperParams.countParam
      :  PATH_CONSTANTS.DEFAULT_START_COUNT_MATCHES; 
  }
}
