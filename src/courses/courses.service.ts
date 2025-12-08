import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: any) {
    const course = this.coursesRepository.create(createCourseDto);
    return await this.coursesRepository.save(course);
  }

  async findAll(search?: string, grado?: string) {
    const query = this.coursesRepository.createQueryBuilder('course')
      .leftJoinAndSelect('course.docente', 'docente');
    
    if (search) {
      query.andWhere('course.titulo LIKE :search', { search: `%${search}%` });
    }
    if (grado) {
      query.andWhere('course.grado = :grado', { grado });
    }
    
    return await query.getMany();
  }

  async findOne(id: number) {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['docente'],
    });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: any) {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return await this.coursesRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.findOne(id);
    await this.coursesRepository.remove(course);
    return { message: 'Curso eliminado correctamente' };
  }
}
