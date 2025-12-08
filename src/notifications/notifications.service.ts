import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  async findAll(usuarioId?: number, leida?: boolean): Promise<Notification[]> {
    const where: any = {};
    if (usuarioId) where.usuarioId = usuarioId;
    if (leida !== undefined) where.leida = leida;
    return this.notificationRepository.find({ where, order: { createdAt: 'DESC' }, take: 50 });
  }

  async findOne(id: number): Promise<Notification> {
    return this.notificationRepository.findOne({ where: { id } });
  }

  async markAsRead(id: number): Promise<Notification> {
    await this.notificationRepository.update(id, { leida: true });
    return this.findOne(id);
  }

  async markAllAsRead(usuarioId: number): Promise<void> {
    await this.notificationRepository.update({ usuarioId, leida: false }, { leida: true });
  }

  async getUnreadCount(usuarioId: number): Promise<number> {
    return this.notificationRepository.count({ where: { usuarioId, leida: false } });
  }

  async remove(id: number): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  async removeAll(usuarioId: number): Promise<void> {
    await this.notificationRepository.delete({ usuarioId });
  }

  // Métodos helper para crear notificaciones específicas
  async notifyNewTask(usuarioId: number, taskTitle: string, courseId: number): Promise<Notification> {
    return this.create({
      usuarioId,
      titulo: 'Nueva tarea asignada',
      mensaje: `Se ha asignado una nueva tarea: ${taskTitle}`,
      tipo: 'info',
      categoria: 'tarea',
      enlace: `/courses/${courseId}`,
    });
  }

  async notifyGrade(usuarioId: number, taskTitle: string, grade: number): Promise<Notification> {
    return this.create({
      usuarioId,
      titulo: 'Tarea calificada',
      mensaje: `Tu tarea "${taskTitle}" ha sido calificada con ${grade}`,
      tipo: 'success',
      categoria: 'calificacion',
    });
  }

  async notifyForumReply(usuarioId: number, forumTitle: string, forumId: number): Promise<Notification> {
    return this.create({
      usuarioId,
      titulo: 'Nueva respuesta en foro',
      mensaje: `Hay una nueva respuesta en el foro: ${forumTitle}`,
      tipo: 'info',
      categoria: 'foro',
      enlace: `/forum/${forumId}`,
    });
  }
}
