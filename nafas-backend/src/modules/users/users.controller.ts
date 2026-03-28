import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.sub);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.sub, body);
  }

  @Put('location')
  @UseGuards(JwtAuthGuard)
  updateLocation(
    @Request() req: any,
    @Body() body: { coordinates: [number, number] },
  ) {
    return this.usersService.updateLocation(req.user.sub, body.coordinates);
  }
}
