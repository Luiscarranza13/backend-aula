import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: any) {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordToCheck = loginDto.password || loginDto.contraseña;
    
    const isPasswordValid = await bcrypt.compare(
      passwordToCheck,
      user.contraseña,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { contraseña, ...result } = user;
    return {
      message: 'Login exitoso',
      user: result,
    };
  }
}
