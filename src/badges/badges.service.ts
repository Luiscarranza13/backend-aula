import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './badge.entity';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Badge)
    private badgeRepository: Repository<Badge>,
  ) {}

  async create(data: any) {
    const badge = this.badgeRepository.create(data);
    return await this.badgeRepository.save(badge);
  }

  async findAll() {
    return await this.badgeRepository.find({ relations: ['usuarios'] });
  }

  async findOne(id: number) {
    return await this.badgeRepository.findOne({
      where: { id },
      relations: ['usuarios'],
    });
  }

  async getUserBadges(userId: number) {
    const badges = await this.badgeRepository
      .createQueryBuilder('badge')
      .leftJoin('badge.usuarios', 'usuario')
      .where('usuario.id = :userId', { userId })
      .getMany();
    return badges;
  }

  async awardBadge(badgeId: number, userId: number) {
    const badge = await this.findOne(badgeId);
    if (!badge.usuarios) badge.usuarios = [];
    
    const user = { id: userId } as any;
    if (!badge.usuarios.find(u => u.id === userId)) {
      badge.usuarios.push(user);
      await this.badgeRepository.save(badge);
    }
    return badge;
  }

  async revokeBadge(badgeId: number, userId: number) {
    const badge = await this.findOne(badgeId);
    badge.usuarios = badge.usuarios.filter(u => u.id !== userId);
    return await this.badgeRepository.save(badge);
  }

  async update(id: number, data: any) {
    await this.badgeRepository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.badgeRepository.delete(id);
    return { message: 'Insignia eliminada' };
  }
}
