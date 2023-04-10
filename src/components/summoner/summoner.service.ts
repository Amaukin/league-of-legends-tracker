import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { AppService } from '../../app.service';
import { RiotDeveloperConfig } from '../../types/riot-developer-config.interface';
import { Summoner } from '../../entities/summoner.entity';
import { SUMMONER_CONSTANTS } from '../../constants/summoner.constants';

@Injectable()
export class SummonerService {
  private riotDeveloperConfig: RiotDeveloperConfig; 
  constructor(
    private appService: AppService,
    private httpService: HttpService
  ) {
    this.riotDeveloperConfig = this.appService.getRiotDeveloperConfig();
  }

  /**
   * @description Finds a summoner by its name.
   * @param {string} summonerName Summoner's name. 
   * @returns Found summoner by summoner's name.
   */
  public getSummonerByName(summonerName: string): Observable<AxiosResponse<Summoner>> {
    const encodedSummonerName = encodeURIComponent(summonerName);
    const url = `${this.riotDeveloperConfig.baseUrl}${SUMMONER_CONSTANTS.BY_NAME_PATH}${encodedSummonerName}`;
    const apiKey = this.riotDeveloperConfig.apiKey;

    const config: AxiosRequestConfig = {
      params: { api_key: apiKey },
    };

    return this.httpService.get(url, config);
  }
}
