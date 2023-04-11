import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';

import { AppService } from '../../app.service';
import { HttpRequestService } from '../http-request/http-request.service';
import { PATH_CONSTANTS } from '../../constants/path.constants';
import { RiotDeveloperConfig } from '../../types/riot-developer-config.interface';
import { SummonerDto } from '../../entities/summoner.dto';

@Injectable()
export class SummonerService {
  private riotDeveloperConfig: RiotDeveloperConfig; 
  constructor(
    private appService: AppService,
    private httpRequestService: HttpRequestService,
    private httpService: HttpService
  ) {
    this.riotDeveloperConfig = this.appService.getRiotDeveloperConfig();
  }

  /**
   * @description Finds a summoner by its name.
   * @param {string} summonerName SummonerDto's name. 
   * @returns Found summoner by summoner's name.
   */
  public async getSummonerByName(summonerName: string, region: string): Promise<SummonerDto> {
    const { config, url } = this.httpRequestService.getRiotDeveloperRequest({summonerName, region}, PATH_CONSTANTS.SUMMONER_BY_NAME_PATH);

    try {
      const response = await lastValueFrom(this.httpService.get(url, config));
      return response.data;
    } catch (error) {
      console.log('An error has ocurred.', error);
    }

  }
}
