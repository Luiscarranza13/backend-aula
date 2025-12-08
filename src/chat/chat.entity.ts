import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  remitenteId: number;

  @Column({ nullable: true })
  destinatarioId: number; // null = mensaje global

  @Column({ type: 'text' })
  contenido: string;

  @Column({ type: 'enum', enum: ['global', 'privado', 'grupo'], default: 'global' })
  tipo: string;

  @Column({ nullable: true })
  grupoId: number; // Para chats de grupo/curso

  @Column({ default: false })
  leido: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'remitenteId' })
  remitente: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'destinatarioId' })
  destinatario: User;
}
