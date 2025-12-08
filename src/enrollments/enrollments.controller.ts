import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() data: any) {
    return this.enrollmentsService.create(data);
  }

  @Get()
  findAll(@Query('estudianteId') estudianteId?: string, @Query('cursoId') cursoId?: string) {
    return this.enrollmentsService.findAll(
      estudianteId ? +estudianteId : undefined,
      cursoId ? +cursoId : undefined
    );
  }

  @Get('student/:estudianteId/courses')
  getStudentCourses(@Param('estudianteId') estudianteId: string) {
    return this.enrollmentsService.getStudentCourses(+estudianteId);
  }

  @Get('course/:cursoId/students')
  getCourseStudents(@Param('cursoId') cursoId: string) {
    return this.enrollmentsService.getCourseStudents(+cursoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.enrollmentsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(+id);
  }
}
