import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: any) {
    const message = this.messagesRepository.create(createMessageDto);
    return await this.messagesRepository.save(message);
  }

  async findAll(forumId?: number) {
    if (forumId) {
      return await this.messagesRepository.find({ 
        where: { foroId: forumId },
        relations: ['usuario'],
        order: { createdAt: 'DESC' }
      });
    }
    return await this.messagesRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number) {
    const message = await this.messagesRepository.findOne({ 
      where: { id },
      relations: ['usuario']
    });
    if (!message) {
      throw new NotFoundException(`Mensaje con ID ${id} no encontrado`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: any) {
    const message = await this.findOne(id);
    Object.assign(message, updateMessageDto);
    return await this.messagesRepository.save(message);
  }

  async remove(id: number) {
    const message = await this.findOne(id);
    await this.messagesRepository.remove(message);
    return { message: 'Mensaje eliminado correctamente' };
  }
}
