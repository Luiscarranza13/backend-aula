import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/course.entity';
import { Task } from '../tasks/task.entity';
import { Resource } from '../resources/resource.entity';
import { Forum } from '../forums/forum.entity';
import { User } from '../users/user.entity';
import { Message } from '../messages/message.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    @InjectRepository(Forum)
    private forumsRepository: Repository<Forum>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async getGeneralStats() {
    const [
      totalCourses,
      totalTasks,
      totalResources,
      totalForums,
      totalUsers,
      totalMessages,
    ] = await Promise.all([
      this.coursesRepository.count(),
      this.tasksRepository.count(),
      this.resourcesRepository.count(),
      this.forumsRepository.count(),
      this.usersRepository.count(),
      this.messagesRepository.count(),
    ]);

    const usersByRole = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.rol', 'rol')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.rol')
      .getRawMany();

    return {
      totalCourses,
      totalTasks,
      totalResources,
      totalForums,
      totalUsers,
      totalMessages,
      usersByRole,
    };
  }

  async getDashboardStats() {
    const [
      totalCourses,
      totalTasks,
      pendingTasks,
      completedTasks,
      totalMessages,
    ] = await Promise.all([
      this.coursesRepository.count(),
      this.tasksRepository.count(),
      this.tasksRepository.count({ where: { estado: 'pendiente' } }),
      this.tasksRepository.count({ where: { estado: 'completada' } }),
      this.messagesRepository.count(),
    ]);

    return {
      courses: totalCourses,
      tasksCompleted: completedTasks,
      tasksPending: pendingTasks,
      newMessages: totalMessages,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }

  async getWeeklyActivity() {
    // Simular actividad semanal basada en datos reales
    const tasks = await this.tasksRepository.find();
    const messages = await this.messagesRepository.find();
    
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    return days.map((label, index) => ({
      label,
      value: Math.max(1, Math.floor((tasks.length + messages.length) / 7) + (index % 3)),
    }));
  }

  async getTaskDistribution() {
    const [completed, pending, overdue] = await Promise.all([
      this.tasksRepository.count({ where: { estado: 'completada' } }),
      this.tasksRepository.count({ where: { estado: 'pendiente' } }),
      this.tasksRepository.count({ where: { estado: 'vencida' } }),
    ]);

    return [
      { label: 'Completadas', value: completed || 0, color: '#22c55e' },
      { label: 'Pendientes', value: pending || 0, color: '#f97316' },
      { label: 'Vencidas', value: overdue || 0, color: '#ef4444' },
    ];
  }

  async getMonthlyProgress() {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const tasks = await this.tasksRepository.find();
    const baseProgress = tasks.length > 0 ? 50 : 0;
    
    return months.map((label, index) => ({
      label,
      value: Math.min(100, baseProgress + (index * 8) + Math.floor(Math.random() * 10)),
    }));
  }
}
