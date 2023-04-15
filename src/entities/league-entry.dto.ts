import { MiniSeriesDTO } from './mini-series.dto';

export class LeagueEntryDto {
  freshBlood: boolean;	
  hotStreak: boolean;	
  inactive: boolean;	
  leagueId: string;
  leaguePoints: number;
  losses: number;
  miniSeries: MiniSeriesDTO;
  queueType: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  tier: string;
  veteran: boolean;	
  wins: number;
}