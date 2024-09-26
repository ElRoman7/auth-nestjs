import { IsNotEmpty, IsEmail, Length } from "class-validator";

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(6,30)
    password: string;
}