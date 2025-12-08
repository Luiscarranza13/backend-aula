import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats() {
    return this.statsService.getGeneralStats();
  }

  @Get('dashboard')
  async getDashboardStats() {
    return this.statsService.getDashboardStats();
  }

  @Get('weekly-activity')
  async getWeeklyActivity() {
    return this.statsService.getWeeklyActivity();
  }

  @Get('task-distribution')
  async getTaskDistribution() {
    return this.statsService.getTaskDistribution();
  }

  @Get('monthly-progress')
  async getMonthlyProgress() {
    return this.statsService.getMonthlyProgress();
  }
}
