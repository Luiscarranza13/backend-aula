import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'profesor')
  create(@Body() createDto: any) {
    return this.attendanceService.create(createDto);
  }

  @Get()
  findAll(
    @Query('cursoId') cursoId?: string,
    @Query('estudianteId') estudianteId?: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.attendanceService.findAll(
      cursoId ? +cursoId : undefined,
      estudianteId ? +estudianteId : undefined,
      fecha,
    );
  }

  @Get('stats/:cursoId')
  getStats(@Param('cursoId') cursoId: string, @Query('estudianteId') estudianteId?: string) {
    return this.attendanceService.getStats(+cursoId, estudianteId ? +estudianteId : undefined);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'profesor')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.attendanceService.update(+id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'profesor')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }
}
