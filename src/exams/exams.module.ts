import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { Exam, ExamQuestion, ExamAttempt } from './exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamQuestion, ExamAttempt])],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
