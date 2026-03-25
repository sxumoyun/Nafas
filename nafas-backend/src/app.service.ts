import { Injectable, OnModuleInit } from '@nestjs/common';
import { StationsService } from 'src/modules/stations/stations.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private stationsService: StationsService) {}

  async onModuleInit() {
    await this.stationsService.seedStations();
  }
}