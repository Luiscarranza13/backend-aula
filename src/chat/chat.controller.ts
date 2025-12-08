import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Enviar mensaje
  @Post()
  create(@Body() data: any) {
    return this.chatService.create(data);
  }

  // Obtener mensajes globales
  @Get('global')
  getGlobalMessages(@Query('limit') limit?: string, @Query('afterId') afterId?: string) {
    return this.chatService.getGlobalMessages(
      limit ? +limit : 50,
      afterId ? +afterId : undefined
    );
  }

  // Obtener mensajes privados
  @Get('private/:userId1/:userId2')
  getPrivateMessages(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
    @Query('limit') limit?: string
  ) {
    return this.chatService.getPrivateMessages(+userId1, +userId2, limit ? +limit : 50);
  }

  // Obtener mensajes de grupo
  @Get('group/:grupoId')
  getGroupMessages(@Param('grupoId') grupoId: string, @Query('limit') limit?: string) {
    return this.chatService.getGroupMessages(+grupoId, limit ? +limit : 50);
  }

  // Obtener conversaciones del usuario
  @Get('conversations/:userId')
  getUserConversations(@Param('userId') userId: string) {
    return this.chatService.getUserConversations(+userId);
  }

  // Marcar como leído
  @Patch('read/:userId/:otherUserId')
  markAsRead(@Param('userId') userId: string, @Param('otherUserId') otherUserId: string) {
    return this.chatService.markAsRead(+userId, +otherUserId);
  }

  // Contar no leídos
  @Get('unread/:userId')
  getUnreadCount(@Param('userId') userId: string) {
    return this.chatService.getUnreadCount(+userId);
  }

  // Polling: nuevos mensajes
  @Get('new')
  getNewMessages(
    @Query('afterId') afterId: string,
    @Query('tipo') tipo: string,
    @Query('grupoId') grupoId?: string
  ) {
    return this.chatService.getNewMessages(
      +afterId,
      tipo || 'global',
      grupoId ? +grupoId : undefined
    );
  }
}
