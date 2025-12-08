import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from '../courses/course.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'datetime', nullable: true })
  fecha_entrega: Date;

  @Column({ default: 'pendiente' })
  estado: string;

  @Column({ name: 'cursoId', nullable: true })
  cursoId: number;

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'cursoId' })
  curso: Course;
}
