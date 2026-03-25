import { Controller, Get, Param, Query } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';

@Controller('air-quality')
export class AirQualityController {
  constructor(private airQualityService: AirQualityService) {}

  @Get('live')
  getLive() {
    return this.airQualityService.getLiveData();
  }

  @Get('stats/daily')
  getDailyStats() {
    return this.airQualityService.getDailyStats();
  }

  @Get('recommendations')
  getRecommendations(@Query('aqi') aqi: string) {
    return this.airQualityService.getRecommendations(Number(aqi));
  }

  @Get(':stationId/history')
  getHistory(
    @Param('stationId') stationId: string,
    @Query('days') days: string,
  ) {
    return this.airQualityService.getHistory(stationId, Number(days) || 7);
  }

  @Get('fetch')
async fetchNow() {
  await this.airQualityService.fetchFromIQAir();
  return { message: 'Ma\'lumotlar yangilandi!' };
}
}