import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Station, StationSchema } from 'src/modules/stations/schema/schema';
import {
  AirQuality,
  AirQualitySchema,
} from '../air-quality/schemas/air-quality.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Station.name, schema: StationSchema },
      { name: AirQuality.name, schema: AirQualitySchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
