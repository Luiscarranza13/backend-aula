import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity('asistencias')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  estudianteId: number;

  @Column()
  cursoId: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'enum', enum: ['presente', 'ausente', 'tardanza', 'justificado'], default: 'presente' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'estudianteId' })
  estudiante: User;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'cursoId' })
  curso: Course;
}
