import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ChatMessage } from './chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatRepository: Repository<ChatMessage>,
  ) {}

  async create(data: Partial<ChatMessage>): Promise<ChatMessage> {
    const message = this.chatRepository.create(data);
    const saved = await this.chatRepository.save(message);
    // Devolver el mensaje con la relación del remitente
    return this.chatRepository.findOne({
      where: { id: saved.id },
      relations: ['remitente', 'destinatario'],
    });
  }

  // Mensajes globales (chat general)
  async getGlobalMessages(limit = 50, afterId?: number): Promise<ChatMessage[]> {
    const where: any = { tipo: 'global' };
    if (afterId) where.id = MoreThan(afterId);
    return this.chatRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['remitente'],
    });
  }

  // Mensajes privados entre dos usuarios
  async getPrivateMessages(userId1: number, userId2: number, limit = 50): Promise<ChatMessage[]> {
    return this.chatRepository
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.remitente', 'remitente')
      .leftJoinAndSelect('msg.destinatario', 'destinatario')
      .where('msg.tipo = :tipo', { tipo: 'privado' })
      .andWhere(
        '((msg.remitenteId = :u1 AND msg.destinatarioId = :u2) OR (msg.remitenteId = :u2 AND msg.destinatarioId = :u1))',
        { u1: userId1, u2: userId2 }
      )
      .orderBy('msg.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  // Mensajes de un grupo/curso
  async getGroupMessages(grupoId: number, limit = 50): Promise<ChatMessage[]> {
    return this.chatRepository.find({
      where: { tipo: 'grupo', grupoId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['remitente'],
    });
  }

  // Obtener conversaciones del usuario
  async getUserConversations(userId: number): Promise<any[]> {
    const messages = await this.chatRepository
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.remitente', 'remitente')
      .leftJoinAndSelect('msg.destinatario', 'destinatario')
      .where('msg.tipo = :tipo', { tipo: 'privado' })
      .andWhere('(msg.remitenteId = :userId OR msg.destinatarioId = :userId)', { userId })
      .orderBy('msg.createdAt', 'DESC')
      .getMany();

    // Agrupar por conversación
    const conversations = new Map();
    messages.forEach(msg => {
      const otherId = msg.remitenteId === userId ? msg.destinatarioId : msg.remitenteId;
      const other = msg.remitenteId === userId ? msg.destinatario : msg.remitente;
      if (!conversations.has(otherId)) {
        conversations.set(otherId, { user: other, lastMessage: msg, unread: 0 });
      }
      if (!msg.leido && msg.destinatarioId === userId) {
        conversations.get(otherId).unread++;
      }
    });

    return Array.from(conversations.values());
  }

  // Marcar mensajes como leídos
  async markAsRead(userId: number, otherUserId: number): Promise<void> {
    await this.chatRepository.update(
      { destinatarioId: userId, remitenteId: otherUserId, leido: false },
      { leido: true }
    );
  }

  // Contar mensajes no leídos
  async getUnreadCount(userId: number): Promise<number> {
    return this.chatRepository.count({
      where: { destinatarioId: userId, leido: false, tipo: 'privado' }
    });
  }

  // Nuevos mensajes desde un ID (para polling)
  async getNewMessages(afterId: number, tipo: string, grupoId?: number): Promise<ChatMessage[]> {
    const where: any = { tipo };
    if (afterId) where.id = MoreThan(afterId);
    if (grupoId) where.grupoId = grupoId;
    return this.chatRepository.find({
      where,
      order: { createdAt: 'ASC' },
      relations: ['remitente'],
    });
  }
}
