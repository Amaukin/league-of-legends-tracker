import { Test, TestingModule } from '@nestjs/testing';
import { PlayerSummaryController } from './player-summary.controller';

describe('PlayerSummaryController', () => {
  let controller: PlayerSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerSummaryController],
    }).compile();

    controller = module.get<PlayerSummaryController>(PlayerSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
