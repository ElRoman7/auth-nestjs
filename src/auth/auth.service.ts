import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { EncoderService } from './encoder.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';
import { ActivateUserDto } from './dto/activate-user.dto';
import { User } from './user.entity';


@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private encoderService: EncoderService,
        private jwtService: JwtService
    ){ }

    async registerUser(registerUserDto:RegisterUserDto ): Promise<void> {
        const {name, email, password} = registerUserDto
        const activationToken = await this.encoderService.generateToken();
        const hashedPassword = await this.encoderService.encodePassword(password);
        
        return this.usersRepository.createUser(name, email, hashedPassword, activationToken);
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

    async activateUser(activateUserDto: ActivateUserDto): Promise<void>{
        const { id, code } = activateUserDto;
        const user : User = await this.usersRepository.findOneInactiveByIdAndActivationToken(id, code);

        // Comprobar que exista el usuario
        if(!user){
            throw new UnprocessableEntityException('This action can not be done');
        }
        // Activar Usuario
        this.usersRepository.activateUser(user);
        this.usersRepository.deleteUserToken(user);
    }

}
