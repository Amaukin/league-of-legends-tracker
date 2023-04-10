import { Module } from '@nestjs/common';
import { PlayerSummaryController } from './player-summary.controller';
import { PlayerSummaryService } from './player-summary.service';

@Module({
  controllers: [PlayerSummaryController],
  providers: [PlayerSummaryService],
})
export class PlayerSummaryModule {}
