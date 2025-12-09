import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../users/usuario.entity';
import { Curso } from '../courses/curso.entity';
import { Inscripcion } from '../enrollments/inscripcion.entity';
import { Tarea } from '../tasks/tarea.entity';
import { Recurso } from '../resources/recurso.entity';
import { Foro } from '../forums/foro.entity';
import { MensajeForo } from '../forums/mensaje-foro.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Curso)
    private cursosRepository: Repository<Curso>,
    @InjectRepository(Inscripcion)
    private inscripcionesRepository: Repository<Inscripcion>,
    @InjectRepository(Tarea)
    private tareasRepository: Repository<Tarea>,
    @InjectRepository(Recurso)
    private recursosRepository: Repository<Recurso>,
    @InjectRepository(Foro)
    private forosRepository: Repository<Foro>,
    @InjectRepository(MensajeForo)
    private mensajesForoRepository: Repository<MensajeForo>,
  ) {}

  async runCompleteSeed() {
    const results = {
      usuarios: 0,
      cursos: 0,
      inscripciones: 0,
      tareas: 0,
      recursos: 0,
      foros: 0,
      mensajes: 0,
    };

    try {
      // 1. USUARIOS
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const usuarios = [
        { nombre: 'Admin Principal', email: 'admin@aula.com', contraseña: hashedPassword, rol: 'admin' },
        { nombre: 'Prof. Juan García', email: 'juan@aula.com', contraseña: hashedPassword, rol: 'profesor' },
        { nombre: 'Prof. María López', email: 'maria@aula.com', contraseña: hashedPassword, rol: 'profesor' },
        { nombre: 'Prof. Carlos Ruiz', email: 'carlos@aula.com', contraseña: hashedPassword, rol: 'profesor' },
        { nombre: 'Ana Martínez', email: 'ana@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
        { nombre: 'Luis Fernández', email: 'luis@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
        { nombre: 'Sofia Torres', email: 'sofia@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
        { nombre: 'Diego Ramírez', email: 'diego@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
        { nombre: 'Laura Sánchez', email: 'laura@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
        { nombre: 'Pedro Morales', email: 'pedro@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
        { nombre: 'Carmen Vega', email: 'carmen@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
        { nombre: 'Roberto Castro', email: 'roberto@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
      ];

      for (const userData of usuarios) {
        const exists = await this.usuariosRepository.findOne({ where: { email: userData.email } });
        if (!exists) {
          await this.usuariosRepository.save(userData);
          results.usuarios++;
        }
      }

      // 2. CURSOS
      const cursosData = [
        { nombre: 'Matemáticas Avanzadas', descripcion: 'Cálculo diferencial e integral, álgebra lineal y ecuaciones diferenciales', profesorId: 2, creditos: 4 },
        { nombre: 'Programación Web Full Stack', descripcion: 'Desarrollo web moderno con React, Node.js, Express y MongoDB', profesorId: 2, creditos: 5 },
        { nombre: 'Inteligencia Artificial', descripcion: 'Machine Learning, Deep Learning y aplicaciones prácticas de IA', profesorId: 3, creditos: 4 },
        { nombre: 'Base de Datos Avanzadas', descripcion: 'SQL, NoSQL, optimización de consultas y diseño de bases de datos', profesorId: 3, creditos: 4 },
        { nombre: 'Desarrollo Móvil', descripcion: 'Creación de apps nativas con React Native y Flutter', profesorId: 4, creditos: 4 },
        { nombre: 'Ciberseguridad', descripcion: 'Seguridad informática, ethical hacking y protección de sistemas', profesorId: 4, creditos: 3 },
        { nombre: 'Cloud Computing', descripcion: 'AWS, Azure, Google Cloud y arquitecturas en la nube', profesorId: 2, creditos: 4 },
        { nombre: 'DevOps y CI/CD', descripcion: 'Docker, Kubernetes, Jenkins y automatización de despliegues', profesorId: 3, creditos: 3 },
        { nombre: 'Diseño UX/UI', descripcion: 'Principios de diseño, Figma, prototipado y experiencia de usuario', profesorId: 4, creditos: 3 },
        { nombre: 'Blockchain y Criptomonedas', descripcion: 'Tecnología blockchain, smart contracts y desarrollo de DApps', profesorId: 2, creditos: 4 },
      ];

      for (const cursoData of cursosData) {
        const exists = await this.cursosRepository.findOne({ where: { nombre: cursoData.nombre } });
        if (!exists) {
          await this.cursosRepository.save(cursoData);
          results.cursos++;
        }
      }

      // 3. INSCRIPCIONES
      for (let cursoId = 1; cursoId <= 10; cursoId++) {
        for (let estudianteId = 5; estudianteId <= 12; estudianteId++) {
          const exists = await this.inscripcionesRepository.findOne({
            where: { estudianteId, cursoId }
          });
          if (!exists) {
            await this.inscripcionesRepository.save({ estudianteId, cursoId });
            results.inscripciones++;
          }
        }
      }

      // 4. TAREAS
      const tareasData = [
        { titulo: 'Derivadas e Integrales', descripcion: 'Resolver los ejercicios del capítulo 5', cursoId: 1, fechaEntrega: '2025-01-20', puntajeMaximo: 20 },
        { titulo: 'Matrices y Determinantes', descripcion: 'Problemas de álgebra lineal', cursoId: 1, fechaEntrega: '2025-01-25', puntajeMaximo: 20 },
        { titulo: 'Proyecto React - Todo App', descripcion: 'Crear una aplicación de tareas con React Hooks', cursoId: 2, fechaEntrega: '2025-01-22', puntajeMaximo: 20 },
        { titulo: 'API REST con Node.js', descripcion: 'Desarrollar una API RESTful con Express', cursoId: 2, fechaEntrega: '2025-01-28', puntajeMaximo: 20 },
        { titulo: 'Regresión Lineal', descripcion: 'Implementar algoritmo de regresión desde cero', cursoId: 3, fechaEntrega: '2025-01-23', puntajeMaximo: 20 },
        { titulo: 'Diseño de Base de Datos', descripcion: 'Modelar una base de datos para e-commerce', cursoId: 4, fechaEntrega: '2025-01-24', puntajeMaximo: 20 },
        { titulo: 'App de Clima', descripcion: 'Aplicación móvil que consume API del clima', cursoId: 5, fechaEntrega: '2025-01-26', puntajeMaximo: 20 },
        { titulo: 'Análisis de Vulnerabilidades', descripcion: 'Identificar vulnerabilidades en aplicación web', cursoId: 6, fechaEntrega: '2025-01-27', puntajeMaximo: 20 },
      ];

      for (const tareaData of tareasData) {
        const exists = await this.tareasRepository.findOne({
          where: { titulo: tareaData.titulo, cursoId: tareaData.cursoId }
        });
        if (!exists) {
          await this.tareasRepository.save(tareaData);
          results.tareas++;
        }
      }

      // 5. RECURSOS
      const recursosData = [
        { titulo: 'Libro: Cálculo de Stewart', tipo: 'pdf', url: 'https://example.com/calculo.pdf', cursoId: 1 },
        { titulo: 'Guía de React Hooks', tipo: 'pdf', url: 'https://example.com/react-hooks.pdf', cursoId: 2 },
        { titulo: 'Dataset: Iris Flowers', tipo: 'archivo', url: 'https://example.com/iris.csv', cursoId: 3 },
        { titulo: 'Cheat Sheet: SQL Commands', tipo: 'pdf', url: 'https://example.com/sql-cheatsheet.pdf', cursoId: 4 },
      ];

      for (const recursoData of recursosData) {
        const exists = await this.recursosRepository.findOne({
          where: { titulo: recursoData.titulo, cursoId: recursoData.cursoId }
        });
        if (!exists) {
          await this.recursosRepository.save(recursoData);
          results.recursos++;
        }
      }

      // 6. FOROS
      const forosData = [
        { titulo: 'Dudas sobre Derivadas', descripcion: 'Espacio para consultas del tema', cursoId: 1, creadorId: 2 },
        { titulo: 'Proyecto Final - Consultas', descripcion: 'Preguntas sobre el proyecto', cursoId: 2, creadorId: 2 },
      ];

      for (const foroData of forosData) {
        const exists = await this.forosRepository.findOne({
          where: { titulo: foroData.titulo, cursoId: foroData.cursoId }
        });
        if (!exists) {
          await this.forosRepository.save(foroData);
          results.foros++;
        }
      }

      return {
        success: true,
        message: 'Seed completado exitosamente',
        results,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error ejecutando seed',
        error: error.message,
      };
    }
  }
}
