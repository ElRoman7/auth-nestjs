import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { RegisterUserDto } from './dto/register-user.dto';


@Injectable()
export class AuthService {
    constructor(private usersRepository: UsersRepository){ }
    async registerUser(registerUserDto:RegisterUserDto ): Promise<void> {
        return this.usersRepository.createUser(registerUserDto)
    }
}
