import { Controller, Get, Param } from '@nestjs/common';

import { SummonerDto } from '../../entities/summoner.dto';
import { SummonerService } from './summoner.service';

@Controller('summoner')
export class SummonerController {
  constructor(private summonerService: SummonerService) {}

  /**
   * @description Gets summoner's by its name.
   * @param {string} summonerName SummonerDto's name. 
   * @returns SummonerDto's data.
   */
  @Get('/by-name/:summonerName/:region')
  public getSummonerByName(@Param('summonerName') summonerName: string, @Param('region') region: string): Promise<SummonerDto> {
    return this.summonerService.getSummonerByName(summonerName, region);
  }
}
