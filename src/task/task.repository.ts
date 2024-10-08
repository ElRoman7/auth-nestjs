import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Task } from "./entities/task.entity";


@Injectable()
export class TaskRepository {
    constructor( 
        @InjectRepository(Task)
        private readonly repository: Repository<Task>
    ) {}

    async createTask(title: string, description: string, status: string, priority:string, due_date: Date, user_id: string): Promise<Task> {
        const task = this.repository.create({title, description, status, priority, due_date, user_id})
        await this.repository.save(task);
        return task;
    }

    async findAll(user_id: string): Promise<Task[]>{
        const tasks = await this.repository.find({
            where: {
                user_id,
                is_deleted: false
            }
        })
        return tasks;
    }

    async findOne(id: number, user_id: string): Promise<Task> {
        const task = await this.repository.findOne({
            where: {
                id,
                user_id,
                is_deleted: false, // Solo obtener la tarea si no está eliminada
            },
        });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found for the current user`);
        }
        return task;
    }

    async updateTask(id: number, user_id: string, updateData: Partial<Task>): Promise<Task> {
        const task = await this.repository.findOne({ where: { id, user_id } });

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found for the current user`);
        }

        // Actualiza las propiedades de la tarea
        Object.assign(task, updateData);

        // Guarda la tarea actualizada en la base de datos
        return await this.repository.save(task);
    }

    async deleteTask(id:number, user_id:string): Promise<void>{
        const task = await this.repository.findOne({where: {id, user_id}});
        
        if(!task){
            throw new NotFoundException(`Task with ID ${id} not found for the current user`);
        }
        task.is_deleted = true;
        await this.repository.save(task);
    }

    async findImportantTasks(user_id: string): Promise<Task[]> {
        // Buscar las tareas que no están eliminadas y que no están completadas
        const tasks = await this.repository.find({
            where: { is_deleted: false, status: In(['pending', 'in-progress']), user_id },
            order: { due_date: 'ASC' }, // Ordenar inicialmente por fecha de vencimiento
        });
    
        const now = new Date();
    
        // Calcular el puntaje de importancia de cada tarea
        const scoredTasks = tasks.map(task => {
            let score = 0;
    
            // Asignar puntos según la prioridad
            if (task.priority === 'high') score += 3;
            else if (task.priority === 'medium') score += 2;
            else score += 1;
    
            // Verificar si la fecha de vencimiento es válida
            const dueDate = new Date(task.due_date);
            if (!isNaN(dueDate.getTime())) {
                const timeDiff = (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24); // Días hasta la fecha de vencimiento
    
                // Asignar puntos según la proximidad de la fecha de vencimiento
                if (timeDiff <= 3) score += 3;
                else if (timeDiff <= 7) score += 2;
                else score += 1;
            }
    
            // Asignar puntos según el estado
            if (task.status === 'pending' || task.status === 'in-progress') score += 2;
    
            // Retornar la tarea con su puntaje calculado
            return { ...task, score };
        });
    
        // Ordenar las tareas por puntaje en orden descendente y tomar las 5 más importantes
        return scoredTasks.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    async findLastTasks(user_id: string): Promise<Task[]>{
        const tasks = await this.repository.find({
            where: {user_id},
            order: { created_at: 'DESC' }, // Asegúrate de ordenar por la columna adecuada
            take: 5, // Limita a los últimos 5 registros
        })
        return tasks;
    }
    
}

