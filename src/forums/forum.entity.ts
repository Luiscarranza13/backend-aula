import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from '../courses/course.entity';

@Entity('forums')
export class Forum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'cursoId', nullable: true })
  cursoId: number;

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'cursoId' })
  curso: Course;
}
