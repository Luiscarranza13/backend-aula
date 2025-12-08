import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async create(data: any) {
    const announcement = this.announcementRepository.create(data);
    return await this.announcementRepository.save(announcement);
  }

  async findAll(cursoId?: number, activo?: boolean) {
    const query = this.announcementRepository.createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.autor', 'autor')
      .leftJoinAndSelect('announcement.curso', 'curso');
    
    if (cursoId) {
      query.andWhere('(announcement.cursoId = :cursoId OR announcement.cursoId IS NULL)', { cursoId });
    }
    if (activo !== undefined) {
      query.andWhere('announcement.activo = :activo', { activo });
    }
    
    return await query.orderBy('announcement.createdAt', 'DESC').getMany();
  }

  async findOne(id: number) {
    return await this.announcementRepository.findOne({
      where: { id },
      relations: ['autor', 'curso'],
    });
  }

  async update(id: number, data: any) {
    await this.announcementRepository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.announcementRepository.delete(id);
    return { message: 'Anuncio eliminado' };
  }
}
