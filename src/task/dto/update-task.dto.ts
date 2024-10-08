import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Length, IsDate } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsNotEmpty()
    @IsString()
    @Length(5, 255)
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    @IsString()
    priority:string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date) // Convierte el valor entrante a un objeto Date
    due_date: Date;
}
