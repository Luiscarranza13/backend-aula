import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column()
  cursoId: number;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cursoId' })
  curso: Course;

  @Column()
  docenteId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'docenteId' })
  docente: User;

  @Column({ default: 60 })
  tiempoLimite: number; // en minutos

  @Column({ type: 'datetime', nullable: true })
  fechaInicio: Date;

  @Column({ type: 'datetime', nullable: true })
  fechaFin: Date;

  @Column({ default: 1 })
  intentosPermitidos: number;

  @Column({ default: true })
  mostrarResultados: boolean;

  @Column({ default: false })
  aleatorizar: boolean;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => ExamQuestion, question => question.exam, { cascade: true })
  preguntas: ExamQuestion[];

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('exam_questions')
export class ExamQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  examId: number;

  @ManyToOne(() => Exam, exam => exam.preguntas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @Column({ type: 'text' })
  pregunta: string;

  @Column({ default: 'multiple' }) // multiple, true_false, short_answer
  tipo: string;

  @Column({ type: 'simple-json', nullable: true })
  opciones: string[]; // Para preguntas de opción múltiple

  @Column({ type: 'text', nullable: true })
  respuestaCorrecta: string;

  @Column({ default: 10 })
  puntos: number;

  @Column({ default: 0 })
  orden: number;
}

@Entity('exam_attempts')
export class ExamAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  examId: number;

  @ManyToOne(() => Exam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @Column()
  estudianteId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'estudianteId' })
  estudiante: User;

  @Column({ type: 'datetime' })
  iniciadoEn: Date;

  @Column({ type: 'datetime', nullable: true })
  finalizadoEn: Date;

  @Column({ type: 'simple-json', nullable: true })
  respuestas: { questionId: number; respuesta: string }[];

  @Column({ type: 'float', nullable: true })
  calificacion: number;

  @Column({ type: 'float', nullable: true })
  porcentaje: number;

  @Column({ default: 'en_progreso' }) // en_progreso, completado, tiempo_agotado
  estado: string;

  @CreateDateColumn()
  createdAt: Date;
}
