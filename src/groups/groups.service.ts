import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async create(data: any) {
    const group = this.groupRepository.create(data);
    return await this.groupRepository.save(group);
  }

  async findAll(cursoId?: number) {
    const query = this.groupRepository.createQueryBuilder('group')
      .leftJoinAndSelect('group.curso', 'curso')
      .leftJoinAndSelect('group.creador', 'creador')
      .leftJoinAndSelect('group.miembros', 'miembros');
    
    if (cursoId) query.andWhere('group.cursoId = :cursoId', { cursoId });
    
    return await query.getMany();
  }

  async findOne(id: number) {
    return await this.groupRepository.findOne({
      where: { id },
      relations: ['curso', 'creador', 'miembros'],
    });
  }

  async addMember(groupId: number, userId: number) {
    const group = await this.findOne(groupId);
    if (!group.miembros) group.miembros = [];
    
    const user = { id: userId } as any;
    if (!group.miembros.find(m => m.id === userId)) {
      group.miembros.push(user);
      await this.groupRepository.save(group);
    }
    return group;
  }

  async removeMember(groupId: number, userId: number) {
    const group = await this.findOne(groupId);
    group.miembros = group.miembros.filter(m => m.id !== userId);
    return await this.groupRepository.save(group);
  }

  async update(id: number, data: any) {
    await this.groupRepository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.groupRepository.delete(id);
    return { message: 'Grupo eliminado' };
  }
}
