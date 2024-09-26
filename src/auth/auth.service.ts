import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { EncoderService } from './encoder.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';


@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private encoderService: EncoderService,
        private jwtService: JwtService
    ){ }

    async registerUser(registerUserDto:RegisterUserDto ): Promise<void> {
        const {name, email, password} = registerUserDto
        const hashedPassword = await this.encoderService.encodePassword(password);
        
        return this.usersRepository.createUser(name, email, hashedPassword)
    }

    async login(loginDTO: LoginDTO):  Promise<{ accessToken: string }>{
        const { email, password } = loginDTO
        const user = await this.usersRepository.findOneByEmail(email);
        if(user && await this.encoderService.checkPassword(password, user.password)){
            const payload : JwtPayload = {id: user.id, email: user.email, active: user.active}
            const accessToken = await this.jwtService.sign(payload);
            return {accessToken};
        }
        throw new UnauthorizedException('Please check your credentials');
    }

}
