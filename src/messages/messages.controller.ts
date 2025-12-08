import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: any) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll(@Query('forumId') forumId?: string) {
    return this.messagesService.findAll(forumId ? +forumId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: any) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateMessageDto: any) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}

// Controlador adicional para /forum-messages
@Controller('forum-messages')
export class ForumMessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(@Query('forumId') forumId?: string) {
    return this.messagesService.findAll(forumId ? +forumId : undefined);
  }

  @Post()
  create(@Body() createMessageDto: any) {
    return this.messagesService.create(createMessageDto);
  }
}
