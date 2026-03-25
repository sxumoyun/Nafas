import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StationsModule } from '../stations/stations.module';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';
import { AirQuality, AirQualitySchema } from './schemas/air-quality.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AirQuality.name, schema: AirQualitySchema }
    ]),
    StationsModule,
  ],
  providers: [AirQualityService],
  controllers: [AirQualityController],
  exports: [AirQualityService],
})
export class AirQualityModule {}