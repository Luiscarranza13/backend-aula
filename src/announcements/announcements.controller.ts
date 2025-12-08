import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'profesor')
  create(@Body() createDto: any) {
    return this.announcementsService.create(createDto);
  }

  @Get()
  findAll(@Query('cursoId') cursoId?: string, @Query('activo') activo?: string) {
    return this.announcementsService.findAll(
      cursoId ? +cursoId : undefined,
      activo ? activo === 'true' : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'profesor')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.announcementsService.update(+id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'profesor')
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(+id);
  }
}
