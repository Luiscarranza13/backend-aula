import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Forum } from '../forums/forum.entity';
import { User } from '../users/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ name: 'foroId', nullable: true })
  foroId: number;

  @Column({ name: 'usuarioId', nullable: true })
  usuarioId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Forum, { nullable: true })
  @JoinColumn({ name: 'foroId' })
  foro: Forum;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;
}
