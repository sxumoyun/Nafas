import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Model } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';
import { StationsService } from '../stations/stations.service';
import { UsersService } from '../users/users.service';
import { AirQuality, AirQualityDocument } from './schemas/air-quality.schema';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

@Injectable()
export class AirQualityService {
  constructor(
    @InjectModel(AirQuality.name)
    private airQualityModel: Model<AirQualityDocument>,
    private stationsService: StationsService,
    private configService: ConfigService,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
  ) {}

  getCategory(aqi: number): string {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'sensitive';
    if (aqi <= 200) return 'bad';
    if (aqi <= 300) return 'very-bad';
    return 'dangerous';
  }

  async getLiveData() {
    const stations = await this.stationsService.findAll();
    const latest = await Promise.all(
      stations.map(async (station) => {
        const data = await this.airQualityModel
          .findOne({ stationId: station._id })
          .sort({ recordedAt: -1 });
        return {
          station: {
            id: station._id,
            name: station.name,
            district: station.district,
            coordinates: station.coordinates,
          },
          aqi: data?.aqi ?? null,
          category: data?.category ?? null,
          pollutants: data?.pollutants ?? null,
          recordedAt: data?.recordedAt ?? null,
        };
      }),
    );
    return latest;
  }

  async getHistory(stationId: string, days: number = 7) {
    const from = new Date();
    from.setDate(from.getDate() - days);
    return this.airQualityModel
      .find({ stationId, recordedAt: { $gte: from } })
      .sort({ recordedAt: 1 });
  }

  async getDailyStats() {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    return this.airQualityModel.aggregate([
      { $match: { recordedAt: { $gte: from } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' } },
          avgAqi: { $avg: '$aqi' },
          maxAqi: { $max: '$aqi' },
          minAqi: { $min: '$aqi' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getRecommendations(aqi: number) {
    const recommendations: Record<
      string,
      { label: string; advice: string; tips: string[] }
    > = {
      good: {
        label: 'Yaxshi',
        advice: "Tashqarida bo'lish mumkin",
        tips: ['Ertalab yugurish mumkin', 'Derazani ochiq qoldiring'],
      },
      moderate: {
        label: "O'rtacha",
        advice: "Sezgir guruhlar ehtiyot bo'lsin",
        tips: [
          'Uzoq vaqt tashqarida qolmang',
          "Sport mashg'ulotlarini kamaytiring",
        ],
      },
      sensitive: {
        label: 'Sezgir',
        advice: 'Astmatiklar cheklash kerak',
        tips: ['Niqob taqib chiqing', 'Derazalarni yoping'],
      },
      bad: {
        label: 'Zararli',
        advice: 'Hamma cheklash kerak',
        tips: ['N95 niqob tavsiya etiladi', 'Havo tozalagich ishlating'],
      },
      'very-bad': {
        label: 'Juda zararli',
        advice: 'Tashqariga chiqmang',
        tips: ['Uyda qoling', "Tibbiy yordam tayyor bo'lsin"],
      },
      dangerous: {
        label: 'Xavfli',
        advice: 'Favqulodda holat',
        tips: ['Tashqariga chiqmang', 'Favqulodda xizmatlarni kuzating'],
      },
    };
    const category = this.getCategory(aqi);
    return recommendations[category];
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Foydalanuvchilarni tekshirish va email yuborish
  async checkAndNotifyUsers(
    district: string,
    aqi: number,
    stationCoordinates: [number, number],
  ) {
    const threshold = this.configService.get<number>('ALERT_THRESHOLD') || 100;
    if (aqi < threshold) return;

    const users = await this.usersService.findAll();

    for (const user of users) {
      if (!user.emailNotification) continue;

      // Foydalanuvchi koordinatalari bo'lsa — masofa tekshiriladi
      if (user.coordinates) {
        const distance = this.calculateDistance(
          user.coordinates[0],
          user.coordinates[1],
          stationCoordinates[0],
          stationCoordinates[1],
        );

        // 10 km dan uzoq bo'lsa — email yuborilmaydi
        if (distance > 10) {
          console.log(
            `${user.email} — ${district} dan ${distance.toFixed(1)} km uzoq, email o'tkazib yuborildi`,
          );
          continue;
        }
      }

      await this.notificationsService.sendAlert(
        user._id.toString(),
        user.email,
        district,
        aqi,
      );
    }
  }

  // Har 30 daqiqada IQAir dan ma'lumot olish
  @Cron('0 */30 * * * *')
  async fetchFromIQAir() {
    console.log("IQAir dan ma'lumot olinmoqda...");
    const apiKey = this.configService.get('IQAIR_API_KEY');
    const stations = await this.stationsService.findAll();

    for (const station of stations) {
      try {
        const [lat, lon] = station.coordinates;
        const url = `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${apiKey}`;
        const { data } = await axios.get(url);
        const pollution = data.data.current.pollution;

        await this.airQualityModel.create({
          stationId: station._id,
          aqi: pollution.aqius,
          pollutants: {
            pm25: pollution.p2?.conc ?? 0,
            pm10: pollution.p1?.conc ?? 0,
            co: 0,
            no2: 0,
            o3: 0,
          },
          category: this.getCategory(pollution.aqius),
          recordedAt: new Date(),
        });

        console.log(`${station.district}: AQI ${pollution.aqius} saqlandi`);

        // Ogohlantirish tekshirish
        // Stansiya koordinatlarini uzatish
        await this.checkAndNotifyUsers(
          station.district,
          pollution.aqius,
          station.coordinates as [number, number],
        );

        // Har so'rov orasida 15 soniya kutish
        await delay(15000);
      } catch (err) {
        console.error(`${station.district} xato:`, err.message);
      }
    }
  }
}
