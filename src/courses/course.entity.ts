import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column()
  grado: string;

  @Column()
  seccion: string;

  @Column({ name: 'docenteId', nullable: true })
  docenteId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'docenteId' })
  docente: User;
}
