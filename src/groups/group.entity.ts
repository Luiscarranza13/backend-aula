import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity('grupos')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column()
  cursoId: number;

  @Column({ nullable: true })
  creadorId: number;

  @Column({ type: 'int', default: 5 })
  maxIntegrantes: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'cursoId' })
  curso: Course;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creadorId' })
  creador: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'grupo_miembros',
    joinColumn: { name: 'grupoId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'usuarioId', referencedColumnName: 'id' },
  })
  miembros: User[];
}
