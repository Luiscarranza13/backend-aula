import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { TasksModule } from './tasks/tasks.module';
import { ResourcesModule } from './resources/resources.module';
import { ForumsModule } from './forums/forums.module';
import { MessagesModule } from './messages/messages.module';
import { StatsModule } from './stats/stats.module';
import { UploadsModule } from './uploads/uploads.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { ExamsModule } from './exams/exams.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'aula_virtual_nest',
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 5000,
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    CoursesModule,
    TasksModule,
    ResourcesModule,
    ForumsModule,
    MessagesModule,
    AuthModule,
    StatsModule,
    UploadsModule,
    EnrollmentsModule,
    SubmissionsModule,
    NotificationsModule,
    ChatModule,
    ExamsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
