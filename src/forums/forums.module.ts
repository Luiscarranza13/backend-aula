import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { Forum } from './forum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forum])],
  controllers: [ForumsController],
  providers: [ForumsService],
})
export class ForumsModule {}
