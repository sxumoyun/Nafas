import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { UsersModule } from 'src/modules/users/users.module';
import { StationsModule } from '../stations/stations.module';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';
import { AirQuality, AirQualitySchema } from './schemas/air-quality.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AirQuality.name, schema: AirQualitySchema },
    ]),
    StationsModule,
    NotificationsModule,
    UsersModule,
  ],
  providers: [AirQualityService],
  controllers: [AirQualityController],
  exports: [AirQualityService],
})
export class AirQualityModule {}
