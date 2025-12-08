import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(@Body() createResourceDto: any) {
    return this.resourcesService.create(createResourceDto);
  }

  @Get()
  findAll(@Query('courseId') courseId?: string) {
    return this.resourcesService.findAll(courseId ? +courseId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceDto: any) {
    return this.resourcesService.update(+id, updateResourceDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateResourceDto: any) {
    return this.resourcesService.update(+id, updateResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(+id);
  }
}
