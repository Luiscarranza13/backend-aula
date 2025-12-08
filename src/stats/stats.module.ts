import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Course } from '../courses/course.entity';
import { Task } from '../tasks/task.entity';
import { Resource } from '../resources/resource.entity';
import { Forum } from '../forums/forum.entity';
import { User } from '../users/user.entity';
import { Message } from '../messages/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Task, Resource, Forum, User, Message]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
