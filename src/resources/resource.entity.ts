import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from '../courses/course.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre_archivo: string;

  @Column({ nullable: true })
  tipo_recurso: string;

  @Column({ nullable: true })
  url: string;

  @Column({ name: 'cursoId', nullable: true })
  cursoId: number;

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'cursoId' })
  curso: Course;
}
