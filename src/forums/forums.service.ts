import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Forum } from './forum.entity';

@Injectable()
export class ForumsService {
  constructor(
    @InjectRepository(Forum)
    private forumsRepository: Repository<Forum>,
  ) {}

  async create(createForumDto: any) {
    const forum = this.forumsRepository.create(createForumDto);
    return await this.forumsRepository.save(forum);
  }

  async findAll(courseId?: number) {
    if (courseId) {
      return await this.forumsRepository.find({ where: { cursoId: courseId } });
    }
    return await this.forumsRepository.find();
  }

  async findOne(id: number) {
    const forum = await this.forumsRepository.findOne({ where: { id } });
    if (!forum) {
      throw new NotFoundException(`Foro con ID ${id} no encontrado`);
    }
    return forum;
  }

  async update(id: number, updateForumDto: any) {
    const forum = await this.findOne(id);
    Object.assign(forum, updateForumDto);
    return await this.forumsRepository.save(forum);
  }

  async remove(id: number) {
    const forum = await this.findOne(id);
    await this.forumsRepository.remove(forum);
    return { message: 'Foro eliminado correctamente' };
  }
}
