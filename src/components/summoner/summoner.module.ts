import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AppService } from '../../app.service';
import { SummonerController } from './summoner.controller';
import { SummonerService } from './summoner.service';

@Module({
  controllers: [SummonerController],
  imports: [HttpModule],
  providers: [AppService, SummonerService],
})
export class SummonerModule {}
