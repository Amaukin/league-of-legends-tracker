import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
