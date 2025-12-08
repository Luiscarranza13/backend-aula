import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Backend Aula Virtual - API funcionando correctamente',
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('api')
  getApi() {
    return {
      message: 'API Aula Virtual',
      version: '1.0.0',
      endpoints: {
        auth: '/auth',
        users: '/users',
        courses: '/courses',
        tasks: '/tasks',
        resources: '/resources',
        forums: '/forums',
        messages: '/messages',
        stats: '/stats',
        uploads: '/uploads',
        enrollments: '/enrollments',
        submissions: '/submissions',
        notifications: '/notifications',
        chat: '/chat',
        exams: '/exams',
      },
    };
  }
}
