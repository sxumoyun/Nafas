import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  aqi: number;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  sentAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
