import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing)
      throw new ConflictException("Bu email allaqachon ro'yxatdan o'tgan");
    return this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password');
  }

  async findAll() {
    return this.userModel.find({ emailNotification: true });
  }

  async updateProfile(id: string, data: Partial<User>) {
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .select('-password');
  }

  async updateLocation(id: string, coordinates: [number, number]) {
    return this.userModel
      .findByIdAndUpdate(id, { coordinates }, { new: true })
      .select('-password');
  }
}
