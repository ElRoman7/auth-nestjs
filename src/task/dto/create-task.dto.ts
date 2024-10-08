import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateTaskDto {
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
