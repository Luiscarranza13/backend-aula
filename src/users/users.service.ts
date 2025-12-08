import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Verificar si es el primer usuario
      const userCount = await this.usersRepository.count();
      
      // REGLA: Solo el primer usuario es admin, el resto son estudiantes
      // El rol NO puede ser especificado en el registro público
      const rol = userCount === 0 ? 'admin' : 'estudiante';
      
      const hashedPassword = await bcrypt.hash(createUserDto.contraseña, 10);
      const user = this.usersRepository.create({
        nombre: createUserDto.nombre,
        email: createUserDto.email,
        contraseña: hashedPassword,
        rol, // Asignado automáticamente, no del DTO
      });
      
      const savedUser = await this.usersRepository.save(user);
      
      // No devolver la contraseña
      const { contraseña, ...result } = savedUser;
      return result;
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    
    // Si se actualiza la contraseña, hashearla
    if (updateUserDto.contraseña) {
      updateUserDto.contraseña = await bcrypt.hash(updateUserDto.contraseña, 10);
    }

    // Actualizar campos permitidos
    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    
    // No devolver la contraseña
    const { contraseña, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { message: 'Usuario eliminado correctamente' };
  }
}
