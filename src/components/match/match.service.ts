import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';

import { HttpRequestService } from '../http-request/http-request.service';
import { MatchDto } from '../../entities/match.dto';
import { PATH_CONSTANTS } from '../../constants/path.constants';
import { SummonerService } from '../summoner/summoner.service';
import { RiotDeveloperRequest } from 'src/types/riot-developer-request.interface';
import { RiotDeveloperParams } from 'src/types/riot-developer-params.interface';
import { MappedMatchDto } from 'src/entities/mapped-match.dto';

const COUNT_VALUE = 20;
const ONE_MINUTE = 60;
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
    const { config : matchesConfig, url : matchesUrl } = await this.getMatchesRequest(summonerName, region);

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
      throw new Error('An error has ocurred. ' + error.response.status + error.response.statusText);
    }
  }

  /**
   * @description Gets recent matches by summoner and region
   * @param {string} summonerName Summoner's name 
   * @param {string} region Summoner's region 
   * @param {number} queueId Queue identifier 
   * @returns {Promise<MatchDto[]>} List of recent matches
   */
  public async getRecentMatchesByFilters(summonerName: string, region: string, queueId: number, startValue: number): Promise<MatchDto[]> {
    const matches = await this.getRecentMatches(summonerName, region, queueId, startValue);

    return matches;
  }

  /**
   * @description Gets recent matches by summoner and region
   * @param {string} summonerName Summoner's name 
   * @param {string} region Summoner's region 
   * @param {number} queueId Queue identifier 
   * @returns {Promise<MatchDto[]>} List of recent matches
   */
  public async getRecentMatchesByFiltersMapped(
    summonerName: string,
    region: string,
    queueId: number,
    startValue: number,
    participantPuiid: string
  ): Promise<MappedMatchDto[]> {
    const matches = await this.getRecentMatches(summonerName, region, queueId, startValue);
    const mappedMatches: MappedMatchDto[] = [];
    for (const match of matches) {
      const participant = match.info.participants.find((participantElement) => participantElement.puuid === participantPuiid)
      const mappedMatch = new MappedMatchDto();
      mappedMatch.assists = participant.assists;
      mappedMatch.championUsedId = participant.championId;
      mappedMatch.csPerMinute = participant.totalMinionsKilled / (match.info.gameDuration / ONE_MINUTE);
      mappedMatch.kda = participant.challenges.kda;
      mappedMatch.kills = participant.kills;
      mappedMatch.runes = participant.perks.styles;
      mappedMatch.spell1Casts = participant.spell1Casts;
      mappedMatch.spell2Casts = participant.spell2Casts;
      mappedMatch.spell3Casts = participant.spell3Casts;
      mappedMatch.spell4Casts = participant.spell4Casts;
      mappedMatch.win = participant.win;

      mappedMatches.push(mappedMatch)
    }

    return mappedMatches;
  }

  /**
   * @description Builds matches request
   * @param {string} summonerName Summoner's name 
   * @param {string} region Summoner's region 
   * @returns {Promise<RiotDeveloperRequest[]>} Built matches request
   */
  private async getMatchesRequest(summonerName: string, region: string, startValue?: number): Promise<RiotDeveloperRequest> {
    const summoner = await this.summonerService.getSummonerByName(summonerName, region);
    const { puuid } = summoner;
    const riotDeveloperParams: RiotDeveloperParams = startValue ?
      {puuid, startParam: startValue, countParam: COUNT_VALUE}
      : {puuid};
    const { config, url } = 
      this.httpRequestService.getRiotDeveloperRequest(riotDeveloperParams, PATH_CONSTANTS.RECENT_MATCHES_BY_PUUID_PATH);
    const riotDeveloperRequest: RiotDeveloperRequest = { config, url };

    return riotDeveloperRequest;
  }

  private async getRecentMatches(summonerName: string, region: string, queueId: number, startValue: number): Promise<MatchDto[]> {
    const { config : matchesConfig, url : matchesUrl } = await this.getMatchesRequest(summonerName, region, startValue);

    const matches: MatchDto[] = [];
    try {
      const matchesResponse = await lastValueFrom(this.httpService.get(matchesUrl, matchesConfig));
      const matchesIds: string[] = matchesResponse.data;
      for (const matchId of matchesIds) {
        const { config, url } = this.httpRequestService.getRiotDeveloperRequest({matchId}, PATH_CONSTANTS.MATCH_PATH);
        try {
          const matchResponse = await lastValueFrom(this.httpService.get(url, config));
          const match = matchResponse.data;
          if (match.info.queueId === queueId) {
            matches.push(match);
          }
        } catch (error) {
          throw new Error('An error has ocurred. ' + error.response.status + error.response.statusText);
          break;
        }
      }
    } catch (error) {
      throw new Error('An error has ocurred. ' + error.response.status + error.response.statusText);
    }
    
    return matches;
  }
}
