import { MatchMetadataDto } from '../entities/match-metadata.dto';
import { MatchInfoDto } from './match-info.dto';

export class MatchDto {
  metadata: MatchMetadataDto;
  info: MatchInfoDto;
}
