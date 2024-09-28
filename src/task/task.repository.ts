import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "./entities/task.entity";


@Injectable()
export class TaskRepository {
    constructor( 
        @InjectRepository(Task)
        private readonly repository: Repository<Task>
    ) {}

    
}