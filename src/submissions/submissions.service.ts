import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  async create(data: Partial<Submission>): Promise<Submission> {
    const submission = this.submissionRepository.create(data);
    return this.submissionRepository.save(submission);
  }

  async findAll(tareaId?: number, estudianteId?: number): Promise<Submission[]> {
    const where: any = {};
    if (tareaId) where.tareaId = tareaId;
    if (estudianteId) where.estudianteId = estudianteId;
    return this.submissionRepository.find({ where, order: { fechaEntrega: 'DESC' } });
  }

  async findOne(id: number): Promise<Submission> {
    return this.submissionRepository.findOne({ where: { id } });
  }

  async findByTaskAndStudent(tareaId: number, estudianteId: number): Promise<Submission> {
    return this.submissionRepository.findOne({ where: { tareaId, estudianteId } });
  }

  async update(id: number, data: Partial<Submission>): Promise<Submission> {
    await this.submissionRepository.update(id, data);
    return this.findOne(id);
  }

  async grade(id: number, calificacion: number, comentario?: string): Promise<Submission> {
    await this.submissionRepository.update(id, {
      calificacion,
      comentarioDocente: comentario,
      estado: 'calificado',
      fechaCalificacion: new Date(),
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.submissionRepository.delete(id);
  }

  async getStudentSubmissions(estudianteId: number): Promise<Submission[]> {
    return this.submissionRepository.find({
      where: { estudianteId },
      relations: ['tarea', 'tarea.curso'],
      order: { fechaEntrega: 'DESC' },
    });
  }

  async getTaskSubmissions(tareaId: number): Promise<Submission[]> {
    return this.submissionRepository.find({
      where: { tareaId },
      relations: ['estudiante'],
      order: { fechaEntrega: 'ASC' },
    });
  }
}
