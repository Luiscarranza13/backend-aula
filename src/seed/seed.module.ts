import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Task } from '../tasks/task.entity';
import { Resource } from '../resources/resource.entity';
import { Forum } from '../forums/forum.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Course,
      Enrollment,
      Task,
      Resource,
      Forum,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
