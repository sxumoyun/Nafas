import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AirQuality,
  AirQualityDocument,
} from '../air-quality/schemas/air-quality.schema';

import { Station, StationDocument } from 'src/modules/stations/schema/schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Station.name)
    private stationModel: Model<StationDocument>,
    @InjectModel(AirQuality.name)
    private airQualityModel: Model<AirQualityDocument>,
  ) {}

  async getDashboardStats() {
    const [users, stations, airQualityCount, latestAqi] = await Promise.all([
      this.userModel.countDocuments(),
      this.stationModel.countDocuments({ isActive: true }),
      this.airQualityModel.countDocuments(),
      this.airQualityModel
        .findOne()
        .sort({ recordedAt: -1 })
        .select('aqi recordedAt'),
    ]);
    return { users, stations, airQualityCount, latestAqi };
  }

  async getUsers() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 });
  }

  async updateUserRole(id: string, role: string) {
    return this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .select('-password');
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async getStations() {
    return this.stationModel.find().sort({ district: 1 });
  }

  async toggleStation(id: string) {
    const station = await this.stationModel.findById(id);
    if (!station) return null;
    station.isActive = !station.isActive;
    return station.save();
  }

  async deleteStation(id: string) {
    return this.stationModel.findByIdAndDelete(id);
  }

  async getRecentAirQuality() {
    return this.airQualityModel
      .find()
      .sort({ recordedAt: -1 })
      .limit(50)
      .populate('stationId', 'district name');
  }

  async clearOldData() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const result = await this.airQualityModel.deleteMany({
      recordedAt: { $lt: oneWeekAgo },
    });
    return { deleted: result.deletedCount };
  }
}
