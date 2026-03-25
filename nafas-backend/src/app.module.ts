import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from 'src/app.service';
import { AirQualityModule } from 'src/modules/air-quality/air-quality.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { StationsModule } from 'src/modules/stations/stations.module';
import { UsersModule } from 'src/modules/users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    StationsModule,
    AirQualityModule,
  ],
   providers: [AppService],
})
export class AppModule {}