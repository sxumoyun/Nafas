import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'Toshkent' })
  district: string;

  @Prop({ default: 100 })
  alertThreshold: number;

  @Prop({ default: true })
  emailNotification: boolean;

  @Prop({ default: false })
  dailyReport: boolean;

  @Prop({ type: [Number], default: null })
  coordinates: [number, number] | null;

  @Prop({ default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
