import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';

import { HttpRequestService } from '../http-request/http-request.service';
import { LeagueEntryDto } from '../../entities/league-entry.dto';
import { MatchDto } from '../../entities/match.dto';
import { MatchService } from '../match/match.service';
import { MatchSummary } from '../../types/match-summary.interface';
import { PATH_CONSTANTS } from '../../constants/path.constants';
import { PlayerSummary } from '../../types/player-summary.interface';
import { QueueTypeEnum } from '../../constants/queue-types.enum';
import { SummonerService } from '../summoner/summoner.service';

const ONE_MINUTE = 60;

@Injectable()
export class PlayerSummaryService {
  constructor(
    private httpRequestService: HttpRequestService,
    private httpService: HttpService,
    @Inject(forwardRef(() => MatchService))
    private matchService: MatchService,
    private summonerService: SummonerService,
  ) {}
  
  /**
   * @description Gets recent matches information by queue
   * @param {string} summonerName Summoner's name 
   * @param {string} region Summoner's region 
   * @param {number} queueId Queue to filter by 
   * @returns {LeagueEntryDto} League rank entry data
   */
  public async getLeagueEntry(summonerId: string, region: string, queueId: number): Promise<LeagueEntryDto> {
    const { config, url } = this.httpRequestService.getRiotDeveloperRequest({ id: summonerId, region }, PATH_CONSTANTS.LEAGUE_ENTRY_BY_ID);

    try {
      const leagueEntriesResponse = await lastValueFrom(this.httpService.get(url, config));
      const leagueEntries: LeagueEntryDto[] = leagueEntriesResponse.data;
      const queueType = this.getQueueTypeById(queueId);
      const foundQueueEntry = leagueEntries.find(leagueEntry => leagueEntry.queueType === queueType)

      return foundQueueEntry;
    } catch (error) {
      throw new Error('An error has ocurred. ' + error.response.status + error.response.statusText);
    }
  }

  /**
   * @description Gets player summary filtered by queue
   * @param {string} summonerName Summoner's name 
   * @param {string} region Summoner's region 
   * @param {number} queueId Queue to filter by 
   * @returns {Promise<PlayerSummary>} Player collected data
   */
  public async getPlayerSummary(summonerName: string, region: string, queueId: number): Promise<PlayerSummary> {
    const summoner = await this.summonerService.getSummonerByName(summonerName, region);
    const leagueEntry = await this.getLeagueEntry(summoner.id, region, queueId);
    const leagueMatches = await this.matchService.getRecentMatchesByFilters(summonerName, region, queueId, 0, leagueEntry.leagueId);
    const matchSummary = this.getMatchSummary(leagueMatches, summoner.puuid);

    return this.mapPlayerSummary(leagueEntry, matchSummary);
  }


  /**
   * @description Gets match summary
   * @param {MatchDto[]} leagueMatches Matches to look into
   * @param {string} puuid Player's puuid
   * @returns {MatchSummary} Built match summary with necessary information
   */
  private getMatchSummary(leagueMatches: MatchDto[], puuid: string): MatchSummary {
    let csPerMinute = 0;
    let gameCount = 0;
    let kda = 0;
    let visionScore = 0;
    for (const leagueMatch of leagueMatches) {
      const participantData = leagueMatch.info.participants.find(participant => participant.puuid === puuid);
      if (participantData) {
        csPerMinute += participantData.totalMinionsKilled / (leagueMatch.info.gameDuration / ONE_MINUTE);
        gameCount++;
        kda += participantData.challenges.kda;
        visionScore += participantData.visionScore;
      }
    }
    const matchSummary: MatchSummary = {
      csPerMinute: csPerMinute / gameCount,
      kda: kda / gameCount,
      visionScore: visionScore / gameCount,
    }

    return matchSummary;
  }

  /**
   * @description Gets queue type
   * @param {number} queueId Queue id 
   * @returns {string} Queue type (name)
   */
  private getQueueTypeById(queueId: number): string {
    const queueType = QueueTypeEnum[queueId];
    if (!queueType) {
      throw new Error('Invalid queue id');
    }

    return queueType;
  }

  /**
   * @description Maps player summary by the league entry and matches summary
   * @param {LeagueEntryDto} leagueEntry League information 
   * @param {MatchSummary} matchSummary Matches recopilated information 
   * @returns {PlayerSummary} Mapped player summary
   */
  private mapPlayerSummary(leagueEntry: LeagueEntryDto, matchSummary: MatchSummary): PlayerSummary {
    const playerSummary: PlayerSummary = {
      csPerMinute: matchSummary.csPerMinute,
      currentRank: leagueEntry.queueType + ' ' + leagueEntry.rank,
      currentLeaguePoints: leagueEntry.leaguePoints,
      losses: leagueEntry.losses,
      kda: matchSummary.kda,
      wins: leagueEntry.wins,
      visionScore: matchSummary.visionScore,
    }

    return playerSummary;
  }
}
