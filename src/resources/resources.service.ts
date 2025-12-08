import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './resource.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
  ) {}

  async create(createResourceDto: any) {
    const resource = this.resourcesRepository.create(createResourceDto);
    return await this.resourcesRepository.save(resource);
  }

  async findAll(courseId?: number) {
    if (courseId) {
      return await this.resourcesRepository.find({ where: { cursoId: courseId } });
    }
    return await this.resourcesRepository.find();
  }

  async findOne(id: number) {
    const resource = await this.resourcesRepository.findOne({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    }
    return resource;
  }

  async update(id: number, updateResourceDto: any) {
    const resource = await this.findOne(id);
    Object.assign(resource, updateResourceDto);
    return await this.resourcesRepository.save(resource);
  }

  async remove(id: number) {
    const resource = await this.findOne(id);
    await this.resourcesRepository.remove(resource);
    return { message: 'Recurso eliminado correctamente' };
  }
}
