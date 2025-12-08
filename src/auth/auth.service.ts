import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

    const payload = { email: user.email, sub: user.id, rol: user.rol };
    const { contraseña, ...result } = user;
    
    return {
      message: 'Login exitoso',
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.contraseña)) {
      const { contraseña, ...result } = user;
      return result;
    }
    return null;
  }
}
