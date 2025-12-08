import { Controller, Get, Post, Body, Param, Delete, Query, Put, Patch } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  create(@Body() data: any) {
    return this.submissionsService.create(data);
  }

  @Get()
  findAll(@Query('tareaId') tareaId?: string, @Query('estudianteId') estudianteId?: string) {
    return this.submissionsService.findAll(
      tareaId ? +tareaId : undefined,
      estudianteId ? +estudianteId : undefined
    );
  }

  @Get('student/:estudianteId')
  getStudentSubmissions(@Param('estudianteId') estudianteId: string) {
    return this.submissionsService.getStudentSubmissions(+estudianteId);
  }

  @Get('task/:tareaId')
  getTaskSubmissions(@Param('tareaId') tareaId: string) {
    return this.submissionsService.getTaskSubmissions(+tareaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.submissionsService.update(+id, data);
  }

  @Patch(':id/grade')
  grade(@Param('id') id: string, @Body() data: { calificacion: number; comentario?: string }) {
    return this.submissionsService.grade(+id, data.calificacion, data.comentario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionsService.remove(+id);
  }
}
