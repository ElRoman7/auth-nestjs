import { IsNotEmpty, IsEmail, IsUUID, Length } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsUUID('4')
    resetPasswordToken: string;
    @IsNotEmpty()
    @Length(6,30)
    password:string
}