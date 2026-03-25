import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Station, StationSchema } from './schema/schema';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }])
  ],
  providers: [StationsService],
  controllers: [StationsController],
  exports: [StationsService],
})
export class StationsModule {}