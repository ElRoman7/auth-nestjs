import { IsNotEmpty, IsUUID, Matches } from "class-validator"

export class ActivateUserDto{
    @IsNotEmpty()
    @IsUUID('4')
    id: string;

    @IsNotEmpty()
    @IsUUID('4')
    code: string;
}