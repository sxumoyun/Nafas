import { Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@Request() req: any) {
    return this.notificationsService.getUserNotifications(req.user.sub);
  }

  @Patch('read')
  @UseGuards(JwtAuthGuard)
  markRead(@Request() req: any) {
    return this.notificationsService.markAsRead(req.user.sub);
  }
}
