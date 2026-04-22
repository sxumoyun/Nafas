import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/users/user.repository';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    const existing = await this.userRepository.create(data);
    console.log(existing);
    return existing;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id);
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async updateProfile(id: string, data: Partial<User>) {
    return this.userRepository.updateProfile(id, data);
  }

  async updateLocation(id: string, coordinates: [number, number]) {
    return this.userRepository.updateLocation(id, coordinates);
  }
}
