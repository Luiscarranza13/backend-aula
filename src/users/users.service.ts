import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: any) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.contraseña, 10);
      const user = this.usersRepository.create({
        ...createUserDto,
        contraseña: hashedPassword,
      });
      return await this.usersRepository.save(user);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }

  async findAll(search?: string, rol?: string) {
    const query = this.usersRepository.createQueryBuilder('user')
      .select(['user.id', 'user.nombre', 'user.email', 'user.rol']);
    
    if (search) {
      query.andWhere('(user.nombre LIKE :search OR user.email LIKE :search)', { search: `%${search}%` });
    }
    if (rol) {
      query.andWhere('user.rol = :rol', { rol });
    }
    
    return await query.getMany();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: any) {
    const user = await this.findOne(id);
    
    if (updateUserDto.contraseña) {
      updateUserDto.contraseña = await bcrypt.hash(updateUserDto.contraseña, 10);
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { message: 'Usuario eliminado correctamente' };
  }
}
