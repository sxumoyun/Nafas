import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Station, StationDocument } from './schema/schema';

@Injectable()
export class StationsService {
  constructor(
    @InjectModel(Station.name) private stationModel: Model<StationDocument>
  ) {}

  async findAll(): Promise<StationDocument[]> {
    return this.stationModel.find({ isActive: true });
  }

  async findById(id: string): Promise<StationDocument | null> {
    return this.stationModel.findById(id);
  }

  async create(data: Partial<Station>): Promise<StationDocument> {
    return this.stationModel.create(data);
  }

  async seedStations() {
    const count = await this.stationModel.countDocuments();
    if (count > 0) return;

    const stations = [
      { name: 'Yunusobod stansiyasi',      district: 'Yunusobod',      coordinates: [41.3565, 69.3232], isActive: true },
      { name: 'Chilonzor stansiyasi',      district: 'Chilonzor',      coordinates: [41.2995, 69.2401], isActive: true },
      { name: 'Sergeli stansiyasi',        district: 'Sergeli',        coordinates: [41.2228, 69.2823], isActive: true },
      { name: 'Bektemir stansiyasi',       district: 'Bektemir',       coordinates: [41.2671, 69.3876], isActive: true },
      { name: 'Mirzo Ulugbek stansiyasi',  district: 'Mirzo Ulug\'bek', coordinates: [41.3412, 69.3565], isActive: true },
      { name: 'Shayxontohur stansiyasi',   district: 'Shayxontohur',   coordinates: [41.3198, 69.2654], isActive: true },
    ];

    await this.stationModel.insertMany(stations);
    console.log('Stansiyalar yaratildi!');
  }
}