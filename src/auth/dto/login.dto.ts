import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  contraseña?: string;
}
