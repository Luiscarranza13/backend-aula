import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() data: any) {
    return this.notificationsService.create(data);
  }

  @Get()
  findAll(@Query('usuarioId') usuarioId?: string, @Query('leida') leida?: string) {
    return this.notificationsService.findAll(
      usuarioId ? +usuarioId : undefined,
      leida !== undefined ? leida === 'true' : undefined
    );
  }

  @Get('unread-count/:usuarioId')
  getUnreadCount(@Param('usuarioId') usuarioId: string) {
    return this.notificationsService.getUnreadCount(+usuarioId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  @Patch('read-all/:usuarioId')
  markAllAsRead(@Param('usuarioId') usuarioId: string) {
    return this.notificationsService.markAllAsRead(+usuarioId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }

  @Delete('all/:usuarioId')
  removeAll(@Param('usuarioId') usuarioId: string) {
    return this.notificationsService.removeAll(+usuarioId);
  }
}
