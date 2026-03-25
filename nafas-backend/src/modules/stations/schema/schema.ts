import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StationDocument = HydratedDocument<Station>;

@Schema({ timestamps: true })
export class Station {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  district: string;

  @Prop({ type: [Number], required: true })
  coordinates: [number, number];

  @Prop({ default: true })
  isActive: boolean;
}

export const StationSchema = SchemaFactory.createForClass(Station);