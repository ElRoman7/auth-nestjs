import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Task } from './entities/task.entity';
import { User } from 'src/users/user.entity';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('important')
  getImportantTasks(@GetUser() user: User) {
    return this.taskService.findTopImportant(user.id);
  }

  @Get('lasts')
  getlastTasks(@GetUser() user: User){
    return this.taskService.findLastTasks(user.id)
  }

  @Post()
  @HttpCode(201)
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.create(createTaskDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.taskService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.findOne(+id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @GetUser() user: User ,@Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, user.id ,updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.remove(+id, user.id);
  }


}
