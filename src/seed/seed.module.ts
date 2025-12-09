import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Usuario } from '../users/usuario.entity';
import { Curso } from '../courses/curso.entity';
import { Inscripcion } from '../enrollments/inscripcion.entity';
import { Tarea } from '../tasks/tarea.entity';
import { Recurso } from '../resources/recurso.entity';
import { Foro } from '../forums/foro.entity';
import { MensajeForo } from '../forums/mensaje-foro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Curso,
      Inscripcion,
      Tarea,
      Recurso,
      Foro,
      MensajeForo,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
