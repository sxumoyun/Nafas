import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AirQualityDocument = HydratedDocument<AirQuality>;

@Schema({ timestamps: true })
export class AirQuality {
  @Prop({ type: Types.ObjectId, ref: 'Station', required: true })
  stationId: Types.ObjectId;

  @Prop({ required: true })
  aqi: number;

  @Prop({
    type: {
      pm25: Number,
      pm10: Number,
      co: Number,
      no2: Number,
      o3: Number,
    },
  })
  pollutants: {
    pm25: number;
    pm10: number;
    co: number;
    no2: number;
    o3: number;
  };

  @Prop({ required: true })
  category: string;

  @Prop({ default: Date.now })
  recordedAt: Date;
}

export const AirQualitySchema = SchemaFactory.createForClass(AirQuality);