import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Exam, ExamQuestion, ExamAttempt } from './exam.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(ExamQuestion)
    private questionRepository: Repository<ExamQuestion>,
    @InjectRepository(ExamAttempt)
    private attemptRepository: Repository<ExamAttempt>,
  ) {}

  // ========== EXAMS ==========
  async createExam(data: Partial<Exam>): Promise<Exam> {
    const exam = this.examRepository.create(data);
    return this.examRepository.save(exam);
  }

  async findAllExams(cursoId?: number): Promise<Exam[]> {
    const where: any = {};
    if (cursoId) where.cursoId = cursoId;
    return this.examRepository.find({
      where,
      relations: ['curso', 'docente', 'preguntas'],
      order: { createdAt: 'DESC' },
    });
  }

  async findExamById(id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['curso', 'docente', 'preguntas'],
    });
    if (!exam) throw new NotFoundException('Examen no encontrado');
    return exam;
  }

  async updateExam(id: number, data: Partial<Exam>): Promise<Exam> {
    await this.examRepository.update(id, data);
    return this.findExamById(id);
  }

  async deleteExam(id: number): Promise<void> {
    await this.examRepository.delete(id);
  }

  // ========== QUESTIONS ==========
  async addQuestion(examId: number, data: Partial<ExamQuestion>): Promise<ExamQuestion> {
    const question = this.questionRepository.create({ ...data, examId });
    return this.questionRepository.save(question);
  }

  async updateQuestion(id: number, data: Partial<ExamQuestion>): Promise<ExamQuestion> {
    await this.questionRepository.update(id, data);
    return this.questionRepository.findOne({ where: { id } });
  }

  async deleteQuestion(id: number): Promise<void> {
    await this.questionRepository.delete(id);
  }

  async getExamQuestions(examId: number): Promise<ExamQuestion[]> {
    return this.questionRepository.find({
      where: { examId },
      order: { orden: 'ASC' },
    });
  }

  // ========== ATTEMPTS ==========
  async startAttempt(examId: number, estudianteId: number): Promise<ExamAttempt> {
    const exam = await this.findExamById(examId);
    
    // Verificar intentos previos
    const previousAttempts = await this.attemptRepository.count({
      where: { examId, estudianteId },
    });
    
    if (previousAttempts >= exam.intentosPermitidos) {
      throw new BadRequestException('Has alcanzado el límite de intentos para este examen');
    }

    // Verificar si hay un intento en progreso
    const inProgress = await this.attemptRepository.findOne({
      where: { examId, estudianteId, estado: 'en_progreso' },
    });
    
    if (inProgress) {
      return inProgress;
    }

    const attempt = this.attemptRepository.create({
      examId,
      estudianteId,
      iniciadoEn: new Date(),
      estado: 'en_progreso',
      respuestas: [],
    });
    
    return this.attemptRepository.save(attempt);
  }

  async submitAttempt(attemptId: number, respuestas: { questionId: number; respuesta: string }[]): Promise<ExamAttempt> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId },
      relations: ['exam', 'exam.preguntas'],
    });
    
    if (!attempt) throw new NotFoundException('Intento no encontrado');
    if (attempt.estado !== 'en_progreso') {
      throw new BadRequestException('Este intento ya fue completado');
    }

    // Calcular calificación
    let puntosObtenidos = 0;
    let puntosTotal = 0;
    
    for (const pregunta of attempt.exam.preguntas) {
      puntosTotal += pregunta.puntos;
      const respuesta = respuestas.find(r => r.questionId === pregunta.id);
      if (respuesta && respuesta.respuesta.toLowerCase().trim() === pregunta.respuestaCorrecta.toLowerCase().trim()) {
        puntosObtenidos += pregunta.puntos;
      }
    }

    const porcentaje = puntosTotal > 0 ? (puntosObtenidos / puntosTotal) * 100 : 0;
    const calificacion = (porcentaje / 100) * 20; // Escala de 0-20

    attempt.respuestas = respuestas;
    attempt.finalizadoEn = new Date();
    attempt.calificacion = Math.round(calificacion * 100) / 100;
    attempt.porcentaje = Math.round(porcentaje * 100) / 100;
    attempt.estado = 'completado';

    return this.attemptRepository.save(attempt);
  }

  async getStudentAttempts(estudianteId: number, examId?: number): Promise<ExamAttempt[]> {
    const where: any = { estudianteId };
    if (examId) where.examId = examId;
    return this.attemptRepository.find({
      where,
      relations: ['exam', 'exam.curso'],
      order: { createdAt: 'DESC' },
    });
  }

  async getExamAttempts(examId: number): Promise<ExamAttempt[]> {
    return this.attemptRepository.find({
      where: { examId },
      relations: ['estudiante'],
      order: { calificacion: 'DESC' },
    });
  }

  async getAttemptById(id: number): Promise<ExamAttempt> {
    return this.attemptRepository.findOne({
      where: { id },
      relations: ['exam', 'exam.preguntas', 'estudiante'],
    });
  }

  // Verificar tiempo restante
  async checkTimeRemaining(attemptId: number): Promise<{ remaining: number; expired: boolean }> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId },
      relations: ['exam'],
    });
    
    if (!attempt) throw new NotFoundException('Intento no encontrado');
    
    const tiempoLimiteMs = attempt.exam.tiempoLimite * 60 * 1000;
    const tiempoTranscurrido = Date.now() - new Date(attempt.iniciadoEn).getTime();
    const remaining = Math.max(0, tiempoLimiteMs - tiempoTranscurrido);
    
    if (remaining === 0 && attempt.estado === 'en_progreso') {
      attempt.estado = 'tiempo_agotado';
      attempt.finalizadoEn = new Date();
      await this.attemptRepository.save(attempt);
    }
    
    return {
      remaining: Math.floor(remaining / 1000), // en segundos
      expired: remaining === 0,
    };
  }
}
