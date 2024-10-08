import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterUserDto{
    @IsNotEmpty()
    @IsString()
    @Length(2, 40)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(6,30)
    password: string;
}