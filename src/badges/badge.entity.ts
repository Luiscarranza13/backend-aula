import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('insignias')
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column()
  icono: string;

  @Column()
  color: string;

  @Column({ type: 'enum', enum: ['bronce', 'plata', 'oro', 'platino'], default: 'bronce' })
  nivel: string;

  @Column({ type: 'text' })
  criterio: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'usuario_insignias',
    joinColumn: { name: 'insigniaId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'usuarioId', referencedColumnName: 'id' },
  })
  usuarios: User[];
}
