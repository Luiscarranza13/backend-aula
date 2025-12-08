import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity('encuestas')
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'json' })
  preguntas: any;

  @Column()
  cursoId: number;

  @Column()
  creadorId: number;

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @Column({ type: 'boolean', default: false })
  anonima: boolean;

  @Column({ type: 'date', nullable: true })
  fechaCierre: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'cursoId' })
  curso: Course;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creadorId' })
  creador: User;
}

@Entity('respuestas_encuesta')
export class SurveyResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  encuestaId: number;

  @Column()
  estudianteId: number;

  @Column({ type: 'json' })
  respuestas: any;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Survey)
  @JoinColumn({ name: 'encuestaId' })
  encuesta: Survey;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'estudianteId' })
  estudiante: User;
}
