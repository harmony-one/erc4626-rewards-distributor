import { Module } from '@nestjs/common';
import { RewardDistController } from './rewards-dist.controller';
import { RewardDistService } from './rewards-dist.service';

@Module({
  imports: [],
  controllers: [RewardDistController],
  providers: [RewardDistService],
})
export class RewardsDistModule {}
