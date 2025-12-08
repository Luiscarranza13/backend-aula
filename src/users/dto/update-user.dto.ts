import { IsEmail, IsOptional, IsIn, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  nombre?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña?: string;

  @IsOptional()
  @IsIn(['admin', 'profesor', 'estudiante'], { message: 'Rol inválido. Debe ser: admin, profesor o estudiante' })
  rol?: string;
}
