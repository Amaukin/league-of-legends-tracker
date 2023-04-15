import { LeagueEntryDto } from './league-entry.dto';

export class LeagueListDto {
  entries:	LeagueEntryDto[];
  leagueId: string;
  name: string;
  queue: string;
  tier: string;
}