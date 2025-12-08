import { Controller, Get, Post, Put, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  // ========== EXAMS ==========
  @Post()
  createExam(@Body() data: any) {
    return this.examsService.createExam(data);
  }

  @Get()
  findAllExams(@Query('cursoId') cursoId?: string) {
    return this.examsService.findAllExams(cursoId ? +cursoId : undefined);
  }

  @Get(':id')
  findExamById(@Param('id') id: string) {
    return this.examsService.findExamById(+id);
  }

  @Put(':id')
  updateExam(@Param('id') id: string, @Body() data: any) {
    return this.examsService.updateExam(+id, data);
  }

  @Delete(':id')
  deleteExam(@Param('id') id: string) {
    return this.examsService.deleteExam(+id);
  }

  // ========== QUESTIONS ==========
  @Post(':examId/questions')
  addQuestion(@Param('examId') examId: string, @Body() data: any) {
    return this.examsService.addQuestion(+examId, data);
  }

  @Get(':examId/questions')
  getExamQuestions(@Param('examId') examId: string) {
    return this.examsService.getExamQuestions(+examId);
  }

  @Put('questions/:id')
  updateQuestion(@Param('id') id: string, @Body() data: any) {
    return this.examsService.updateQuestion(+id, data);
  }

  @Delete('questions/:id')
  deleteQuestion(@Param('id') id: string) {
    return this.examsService.deleteQuestion(+id);
  }

  // ========== ATTEMPTS ==========
  @Post(':examId/start')
  startAttempt(@Param('examId') examId: string, @Body('estudianteId') estudianteId: number) {
    return this.examsService.startAttempt(+examId, estudianteId);
  }

  @Post('attempts/:attemptId/submit')
  submitAttempt(
    @Param('attemptId') attemptId: string,
    @Body('respuestas') respuestas: { questionId: number; respuesta: string }[],
  ) {
    return this.examsService.submitAttempt(+attemptId, respuestas);
  }

  @Get('attempts/student/:estudianteId')
  getStudentAttempts(
    @Param('estudianteId') estudianteId: string,
    @Query('examId') examId?: string,
  ) {
    return this.examsService.getStudentAttempts(+estudianteId, examId ? +examId : undefined);
  }

  @Get(':examId/attempts')
  getExamAttempts(@Param('examId') examId: string) {
    return this.examsService.getExamAttempts(+examId);
  }

  @Get('attempts/:id')
  getAttemptById(@Param('id') id: string) {
    return this.examsService.getAttemptById(+id);
  }

  @Get('attempts/:attemptId/time')
  checkTimeRemaining(@Param('attemptId') attemptId: string) {
    return this.examsService.checkTimeRemaining(+attemptId);
  }
}
