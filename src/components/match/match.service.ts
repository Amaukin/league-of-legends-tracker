import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';

import { HttpRequestService } from '../http-request/http-request.service';
import { LeaderboardDto } from '../../entities/leaderboard.dto';
import { LeagueListDto } from '../../entities/league-list.dto';
import { MappedMatchDto } from '../../entities/mapped-match.dto';
import { MatchDto } from '../../entities/match.dto';
import { PATH_CONSTANTS } from '../../constants/path.constants';
import { PlayerSummaryService } from '../player-summary/player-summary.service';
import { SummonerService } from '../summoner/summoner.service';
import { RiotDeveloperRequest } from '../../types/riot-developer-request.interface';
import { RiotDeveloperParams } from '../../types/riot-developer-params.interface';

const COUNT_VALUE = 20;
const ONE_MINUTE = 60;
const TOP_STRING = 'top: ';
@Injectable()
export class MatchService {
  constructor(
    private eventEmitter: EventEmitter2,
    private httpRequestService: HttpRequestService,
    private httpService: HttpService,
    private playerSummaryService: PlayerSummaryService,
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
   * @param {startValue} startValue Start value for pagination
   * @param {leagueId} leagueId League id for leaderboard subject
   * @returns {Promise<MatchDto[]>} List of recent matches
   */
  public async getRecentMatchesByFilters(summonerName: string, region: string, queueId: number, startValue: number, leagueId?: string): Promise<MatchDto[]> {
    const matches = await this.getRecentMatches(summonerName, region, queueId, startValue);

    this.updateLeaderboardData(summonerName,region, queueId, leagueId);

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
   * @description Gets league identifier
   * @param {string} summonerName Summoner's name
   * @param {string} region Summoner's region
   * @param {number} queueId Queue identifier to filter by
   * @returns {Promise<string>} League identifier
   */
  private async getLeagueId(summonerName: string, region: string, queueId: number): Promise<string> {
    const summoner = await this.summonerService.getSummonerByName(summonerName, region);
    const leagueEntry = await this.playerSummaryService.getLeagueEntry(summoner.id, region, queueId)
    
    return leagueEntry.leagueId;
  }

  /**
   * @description Gets league list data
   * @param {AxiosRequestConfig} config Configuration for the http request
   * @param {string} url Where is the request sent to
   * @returns {Promise<LeagueListDto>} League list data sorted by league points
   */
  private async getLeagueList(config: AxiosRequestConfig, url: string): Promise<LeagueListDto> {
    try {
      const leagueListResponse = await lastValueFrom(this.httpService.get(url, config));
      const leagueList: LeagueListDto = leagueListResponse.data;
      leagueList.entries.sort((leagueEntry, leagueEntryToCompare) => leagueEntry.leaguePoints < leagueEntryToCompare.leaguePoints ? 1 : -1)
      return leagueList;
    } catch (error) {
      throw new Error('An error has ocurred. ' + error.response.status + error.response.statusText);
    }
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
        }
      }
    } catch (error) {
      throw new Error('An error has ocurred. ' + error.response.status + error.response.statusText);
    }
    
    return matches;
  }

  /**
   * @description Sorts league list entries by winrate
   * @param {LeagueListDto} leagueList List to sort
   */
  private sortLeagueListByWinrate(leagueList: LeagueListDto): void {
    leagueList.entries.sort((leagueEntry, leagueEntryToCompare) => 
      (leagueEntry.wins / (leagueEntry.wins + leagueEntry.losses)) < 
      (leagueEntryToCompare.wins / (leagueEntryToCompare.wins + leagueEntryToCompare.losses)) ? 1 : -1);
  }

  /**
   * @description Gets league list and updates the leaderboard data
   * @param {string} summonerName Summoner's name
   * @param {string} region Summoner's region
   * @param {number} queueId Queue identifier
   * @param {number} leagueId League identifier
   */
  private async updateLeaderboardData(summonerName: string, region: string, queueId: number, leagueId: string): Promise<void> {
    const foundLeagueId = leagueId ? leagueId : await this.getLeagueId(summonerName, region, queueId);
    const { config, url } = 
      this.httpRequestService.getRiotDeveloperRequest({leagueId: foundLeagueId, region}, PATH_CONSTANTS.LEAGUE_BY_ID);
    const leagueList = await this.getLeagueList(config, url);
    let foundSummoner = leagueList.entries.find(leagueEntry => leagueEntry.summonerName === summonerName);
    const summonerRankByLeaguePoints = leagueList.entries.indexOf(foundSummoner);
    this.sortLeagueListByWinrate(leagueList);
    foundSummoner = leagueList.entries.find(leagueEntry => leagueEntry.summonerName === summonerName);
    const summonerRankByWinRate = leagueList.entries.indexOf(foundSummoner);

    const leaderboardData: LeaderboardDto = { 
      leaguePoints: TOP_STRING + summonerRankByLeaguePoints,
      queue: leagueList.queue + ' ' + leagueList.tier,
      winRate: TOP_STRING + summonerRankByWinRate
    };
    this.eventEmitter.emit('leaderboardDataUpdated', leaderboardData);
  }
}
