import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('badges')
@UseGuards(JwtAuthGuard)
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createDto: any) {
    return this.badgesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.badgesService.findAll();
  }

  @Get('user/:userId')
  getUserBadges(@Param('userId') userId: string) {
    return this.badgesService.getUserBadges(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.badgesService.findOne(+id);
  }

  @Post(':id/award')
  @UseGuards(RolesGuard)
  @Roles('admin', 'profesor')
  awardBadge(@Param('id') id: string, @Body('userId') userId: number) {
    return this.badgesService.awardBadge(+id, userId);
  }

  @Delete(':id/revoke/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'profesor')
  revokeBadge(@Param('id') id: string, @Param('userId') userId: string) {
    return this.badgesService.revokeBadge(+id, +userId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.badgesService.update(+id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.badgesService.remove(+id);
  }
}
