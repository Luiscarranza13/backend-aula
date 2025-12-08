import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  estudianteId: number;

  @Column()
  cursoId: number;

  @Column({ type: 'enum', enum: ['activo', 'completado', 'abandonado'], default: 'activo' })
  estado: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progreso: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  notaFinal: number;

  @CreateDateColumn()
  fechaInscripcion: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'estudianteId' })
  estudiante: User;

  @ManyToOne(() => Course, { eager: true })
  @JoinColumn({ name: 'cursoId' })
  curso: Course;
}
