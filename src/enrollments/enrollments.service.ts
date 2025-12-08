import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(data: Partial<Enrollment>): Promise<Enrollment> {
    const enrollment = this.enrollmentRepository.create(data);
    return this.enrollmentRepository.save(enrollment);
  }

  async findAll(estudianteId?: number, cursoId?: number): Promise<Enrollment[]> {
    const where: any = {};
    if (estudianteId) where.estudianteId = estudianteId;
    if (cursoId) where.cursoId = cursoId;
    return this.enrollmentRepository.find({ where, order: { fechaInscripcion: 'DESC' } });
  }

  async findOne(id: number): Promise<Enrollment> {
    return this.enrollmentRepository.findOne({ where: { id } });
  }

  async findByStudentAndCourse(estudianteId: number, cursoId: number): Promise<Enrollment> {
    return this.enrollmentRepository.findOne({ where: { estudianteId, cursoId } });
  }

  async update(id: number, data: Partial<Enrollment>): Promise<Enrollment> {
    await this.enrollmentRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.enrollmentRepository.delete(id);
  }

  async getStudentCourses(estudianteId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { estudianteId },
      relations: ['curso', 'curso.docente'],
    });
  }

  async getCourseStudents(cursoId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { cursoId },
      relations: ['estudiante'],
    });
  }
}
