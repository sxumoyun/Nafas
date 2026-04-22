import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { SuperAdminGuard } from 'src/modules/auth/superAdmin';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Dashboard — barcha adminlar ko'ra oladi
  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  // Foydalanuvchilar — barcha adminlar ko'ra oladi
  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  // Role o'zgartirish — faqat superadmin
  @Patch('users/:id/role')
  @UseGuards(SuperAdminGuard)
  updateRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.adminService.updateUserRole(id, body.role);
  }

  // Foydalanuvchi o'chirish — faqat superadmin
  @Delete('users/:id')
  @UseGuards(SuperAdminGuard)
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Stansiyalar — barcha adminlar ko'ra oladi
  @Get('stations')
  getStations() {
    return this.adminService.getStations();
  }

  // Stansiya yoqish/o'chirish — barcha adminlar
  @Patch('stations/:id/toggle')
  toggleStation(@Param('id') id: string) {
    return this.adminService.toggleStation(id);
  }

  // Stansiya o'chirish — faqat superadmin
  @Delete('stations/:id')
  @UseGuards(SuperAdminGuard)
  deleteStation(@Param('id') id: string) {
    return this.adminService.deleteStation(id);
  }

  // AQI ma'lumotlar — barcha adminlar
  @Get('air-quality')
  getAirQuality() {
    return this.adminService.getRecentAirQuality();
  }

  // Eski ma'lumotlarni o'chirish — faqat superadmin
  @Delete('air-quality/clear')
  @UseGuards(SuperAdminGuard)
  clearAirQuality() {
    return this.adminService.clearOldData();
  }
}
