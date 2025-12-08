import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tareaId: number;

  @Column()
  estudianteId: number;

  @Column({ type: 'text', nullable: true })
  contenido: string;

  @Column({ nullable: true })
  archivoUrl: string;

  @Column({ nullable: true })
  archivoNombre: string;

  @Column({ type: 'enum', enum: ['pendiente', 'entregado', 'calificado', 'tarde'], default: 'entregado' })
  estado: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  calificacion: number;

  @Column({ type: 'text', nullable: true })
  comentarioDocente: string;

  @CreateDateColumn()
  fechaEntrega: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaCalificacion: Date;

  @ManyToOne(() => Task, { eager: true })
  @JoinColumn({ name: 'tareaId' })
  tarea: Task;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'estudianteId' })
  estudiante: User;
}
