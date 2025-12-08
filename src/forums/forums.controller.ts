import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ForumsService } from './forums.service';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post()
  create(@Body() createForumDto: any) {
    return this.forumsService.create(createForumDto);
  }

  @Get()
  findAll(@Query('courseId') courseId?: string) {
    return this.forumsService.findAll(courseId ? +courseId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForumDto: any) {
    return this.forumsService.update(+id, updateForumDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateForumDto: any) {
    return this.forumsService.update(+id, updateForumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forumsService.remove(+id);
  }
}
