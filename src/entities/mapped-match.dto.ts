import { PerkStyleDto } from './perkStyle.dto';

export class MappedMatchDto {
  assists: number;
  championUsedId: number;
  csPerMinute: number;
  kda: number;
  kills: number;
  runes: PerkStyleDto[];
  spell1Casts: number; 
  spell2Casts: number; 
  spell3Casts: number; 
  spell4Casts: number; 
  win: boolean;
}
