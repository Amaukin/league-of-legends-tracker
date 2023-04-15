import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';

import { HttpRequestService } from '../http-request/http-request.service';
import { PATH_CONSTANTS } from '../../constants/path.constants';
import { SummonerDto } from '../../entities/summoner.dto';

@Injectable()
export class SummonerService {
  constructor(
    private httpRequestService: HttpRequestService,
    private httpService: HttpService
  ) {
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
      throw new Error('An error has ocurred. ' + error.response.status + error.response.statusText);
    }

  }
}
