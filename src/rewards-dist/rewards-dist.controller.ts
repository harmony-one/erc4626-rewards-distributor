import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { RewardDistService } from './rewards-dist.service';

@ApiTags('rewards')
@Controller('rewards')
export class RewardDistController {
  constructor(
    private readonly configService: ConfigService,
    private readonly rewardDistService: RewardDistService
  ) { }
  @Get('/list')
  getEvents() {
    return this.rewardDistService.list();
  }

  @Get('/info')
  getInfo() {
    return this.rewardDistService.info();
  }

  @Get('/events-tracker-info')
  getEventsTrackerInfo() {
    return this.rewardDistService.eventsTrackerInfo();
  }
}
