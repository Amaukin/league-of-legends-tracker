import { Controller, Get, Param } from '@nestjs/common';

import { map, Observable } from 'rxjs';
import { Summoner } from '../../entities/summoner.entity';
import { SummonerService } from './summoner.service';

@Controller('summoner')
export class SummonerController {
  constructor(private summonerService: SummonerService) {}

  @Get('/by-name/:summonerName')
  public getSummonerByName(@Param('summonerName') summonerName: string): Observable<Summoner> {
    return this.summonerService.getSummonerByName(summonerName).pipe(map((response) => response.data));
  }
}
