import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import {
  Notification,
  NotificationDocument,
} from 'src/modules/notifications/schemas/schema';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendAlert(
    userId: string,
    email: string,
    district: string,
    aqi: number,
  ) {
    const message = `${district} tumanida havo sifati xavfli darajaga yetdi. AQI: ${aqi}. Tashqariga chiqmaslikni tavsiya etamiz.`;

    // MongoDB ga saqlash
    await this.notificationModel.create({
      userId,
      message,
      district,
      aqi,
    });

    // Email yuborish
    await this.transporter.sendMail({
      from: `"Nafas" <${this.configService.get('EMAIL_USER')}>`,
      to: email,
      subject: `⚠️ ${district}: Havo sifati xavfli darajada!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #2E74B5; padding: 20px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0;">🌫️ Nafas</h2>
          </div>
          <div style="background: #fff; border: 1px solid #e5e7eb; padding: 24px; border-radius: 0 0 12px 12px;">
            <div style="background: #FFEBEE; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
              <h3 style="color: #A32D2D; margin: 0 0 8px;">⚠️ Xavfli daraja!</h3>
              <p style="color: #791F1F; margin: 0;">${message}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; color: #6b7280; font-size: 14px;">Tuman</td>
                <td style="padding: 8px; font-weight: 500;">${district}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 8px; color: #6b7280; font-size: 14px;">AQI</td>
                <td style="padding: 8px; font-weight: 500; color: #A32D2D;">${aqi}</td>
              </tr>
              <tr>
                <td style="padding: 8px; color: #6b7280; font-size: 14px;">Vaqt</td>
                <td style="padding: 8px; font-weight: 500;">${new Date().toLocaleString('uz-UZ')}</td>
              </tr>
            </table>
            <p style="color: #6b7280; font-size: 13px; margin-top: 16px;">
              Bu xabar Nafas tizimi tomonidan avtomatik yuborildi.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`Email yuborildi: ${email} — ${district} AQI: ${aqi}`);
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ sentAt: -1 })
      .limit(20);
  }

  async markAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );
  }
}
