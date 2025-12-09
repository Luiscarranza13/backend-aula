import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Task } from '../tasks/task.entity';
import { Resource } from '../resources/resource.entity';
import { Forum } from '../forums/forum.entity';
import { ForumMessage } from '../forums/forum-message.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    @InjectRepository(Forum)
    private forumsRepository: Repository<Forum>,
    @InjectRepository(ForumMessage)
    private forumMessagesRepository: Repository<ForumMessage>,
  ) {}

  async runCompleteSeed() {
    const results = {
      usuarios: 0,
      cursos: 0,
      inscripciones: 0,
      tareas: 0,
      recursos: 0,
      foros: 0,
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
        const exists = await this.usersRepository.findOne({ where: { email: userData.email } });
        if (!exists) {
          await this.usersRepository.save(userData);
          results.usuarios++;
        }
      }

      // 2. CURSOS
      const cursosData = [
        { titulo: 'Matemáticas Avanzadas', descripcion: 'Cálculo diferencial e integral, álgebra lineal y ecuaciones diferenciales', docenteId: 2 },
        { titulo: 'Programación Web Full Stack', descripcion: 'Desarrollo web moderno con React, Node.js, Express y MongoDB', docenteId: 2 },
        { titulo: 'Inteligencia Artificial', descripcion: 'Machine Learning, Deep Learning y aplicaciones prácticas de IA', docenteId: 3 },
        { titulo: 'Base de Datos Avanzadas', descripcion: 'SQL, NoSQL, optimización de consultas y diseño de bases de datos', docenteId: 3 },
        { titulo: 'Desarrollo Móvil', descripcion: 'Creación de apps nativas con React Native y Flutter', docenteId: 4 },
        { titulo: 'Ciberseguridad', descripcion: 'Seguridad informática, ethical hacking y protección de sistemas', docenteId: 4 },
        { titulo: 'Cloud Computing', descripcion: 'AWS, Azure, Google Cloud y arquitecturas en la nube', docenteId: 2 },
        { titulo: 'DevOps y CI/CD', descripcion: 'Docker, Kubernetes, Jenkins y automatización de despliegues', docenteId: 3 },
        { titulo: 'Diseño UX/UI', descripcion: 'Principios de diseño, Figma, prototipado y experiencia de usuario', docenteId: 4 },
        { titulo: 'Blockchain y Criptomonedas', descripcion: 'Tecnología blockchain, smart contracts y desarrollo de DApps', docenteId: 2 },
      ];

      for (const cursoData of cursosData) {
        const exists = await this.coursesRepository.findOne({ where: { titulo: cursoData.titulo } });
        if (!exists) {
          await this.coursesRepository.save(cursoData);
          results.cursos++;
        }
      }

      // 3. INSCRIPCIONES
      for (let cursoId = 1; cursoId <= 10; cursoId++) {
        for (let estudianteId = 5; estudianteId <= 12; estudianteId++) {
          const exists = await this.enrollmentsRepository.findOne({
            where: { estudianteId, cursoId }
          });
          if (!exists) {
            await this.enrollmentsRepository.save({ estudianteId, cursoId });
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
        const exists = await this.tasksRepository.findOne({
          where: { titulo: tareaData.titulo, cursoId: tareaData.cursoId }
        });
        if (!exists) {
          await this.tasksRepository.save(tareaData);
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
        const exists = await this.resourcesRepository.findOne({
          where: { titulo: recursoData.titulo, cursoId: recursoData.cursoId }
        });
        if (!exists) {
          await this.resourcesRepository.save(recursoData);
          results.recursos++;
        }
      }

      // 6. FOROS
      const forosData = [
        { titulo: 'Dudas sobre Derivadas', descripcion: 'Espacio para consultas del tema', cursoId: 1, creadorId: 2 },
        { titulo: 'Proyecto Final - Consultas', descripcion: 'Preguntas sobre el proyecto', cursoId: 2, creadorId: 2 },
      ];

      for (const foroData of forosData) {
        const exists = await this.forumsRepository.findOne({
          where: { titulo: foroData.titulo, cursoId: foroData.cursoId }
        });
        if (!exists) {
          await this.forumsRepository.save(foroData);
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
