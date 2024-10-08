import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './entities/task.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class TaskService {

  constructor(private taskRepository: TaskRepository) {}


  async create(createTaskDto: CreateTaskDto, user : User): Promise<Task> {
    const { id: user_id } = user;
    const { description, due_date, priority, status, title } = createTaskDto
    console.log("Fecha recibida en el backend:", due_date);

    try {
      return this.taskRepository.createTask(title, description, status, priority, due_date, user_id)
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    
  }

  findAll(user: User): Promise<Task[]> {
    const { id : user_id } = user;
    return this.taskRepository.findAll(user_id);
  }

  findOne(id: number, user_id: string) {
    try {
      return this.taskRepository.findOne(id, user_id);
    } catch (error) {
      throw new InternalServerErrorException();
    }

  }

  async update(id: number, user_id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return await this.taskRepository.updateTask(id, user_id, updateTaskDto);
  }

  remove(id: number, user_id: string): Promise<void> {
    return this.taskRepository.deleteTask(id, user_id);
    // return `This action removes a #${id} task`;
  }

  findTopImportant(user_id: string): Promise<Task[]>{    
    return this.taskRepository.findImportantTasks(user_id);
  }

  findLastTasks(user_id: string): Promise<Task[]>{
    try {
      const tasks = this.taskRepository.findLastTasks(user_id)
      if(!tasks){
        throw new NotFoundException('No tasks available');
      }
      return tasks;
    } catch (error) {
      throw new InternalServerErrorException();      
    }
  }
}
