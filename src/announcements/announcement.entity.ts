import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity('anuncios')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column()
  autorId: number;

  @Column({ nullable: true })
  cursoId: number;

  @Column({ type: 'enum', enum: ['urgente', 'importante', 'normal', 'info'], default: 'normal' })
  prioridad: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'autorId' })
  autor: User;

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'cursoId' })
  curso: Course;
}
