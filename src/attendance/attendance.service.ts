import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async create(data: any) {
    const attendance = this.attendanceRepository.create(data);
    return await this.attendanceRepository.save(attendance);
  }

  async findAll(cursoId?: number, estudianteId?: number, fecha?: string) {
    const query = this.attendanceRepository.createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.estudiante', 'estudiante')
      .leftJoinAndSelect('attendance.curso', 'curso');
    
    if (cursoId) query.andWhere('attendance.cursoId = :cursoId', { cursoId });
    if (estudianteId) query.andWhere('attendance.estudianteId = :estudianteId', { estudianteId });
    if (fecha) query.andWhere('attendance.fecha = :fecha', { fecha });
    
    return await query.orderBy('attendance.fecha', 'DESC').getMany();
  }

  async getStats(cursoId: number, estudianteId?: number) {
    const query = this.attendanceRepository.createQueryBuilder('attendance')
      .where('attendance.cursoId = :cursoId', { cursoId });
    
    if (estudianteId) query.andWhere('attendance.estudianteId = :estudianteId', { estudianteId });
    
    const total = await query.getCount();
    const presente = await query.andWhere('attendance.estado = :estado', { estado: 'presente' }).getCount();
    const ausente = await this.attendanceRepository.count({ where: { cursoId, estado: 'ausente' } });
    const tardanza = await this.attendanceRepository.count({ where: { cursoId, estado: 'tardanza' } });
    
    return { total, presente, ausente, tardanza, porcentaje: total > 0 ? (presente / total * 100).toFixed(2) : 0 };
  }

  async update(id: number, data: any) {
    await this.attendanceRepository.update(id, data);
    return await this.attendanceRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.attendanceRepository.delete(id);
    return { message: 'Asistencia eliminada' };
  }
}
