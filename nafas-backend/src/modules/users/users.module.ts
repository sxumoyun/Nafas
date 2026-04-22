import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/modules/users/user.repository';
import { UsersController } from 'src/modules/users/users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
