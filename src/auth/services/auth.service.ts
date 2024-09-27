import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { EncoderService } from './encoder.service';
import { JwtService } from '@nestjs/jwt';
import { ActivateUserDto } from '../dto/activate-user.dto';
import { LoginDTO } from '../dto/login.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { JwtPayload } from '../interfaces/jwt.payload.interface';
import { User } from '../user.entity';
import { UsersRepository } from '../user.repository';
import { RequestResetPasswordDto } from '../dto/request-reset-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';



@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private encoderService: EncoderService,
        private jwtService: JwtService
    ){ }

    async registerUser(registerUserDto:RegisterUserDto ): Promise<void> {
        const { name, email, password } = registerUserDto;
        const activationToken = await this.encoderService.generateToken();
        const hashedPassword = await this.encoderService.encodePassword(password);
        
        return this.usersRepository.createUser(name, email, hashedPassword, activationToken);
    }

    async login(loginDTO: LoginDTO):  Promise<{ accessToken: string }>{
        const { email, password } = loginDTO
        const user: User = await this.usersRepository.findOneByEmail(email);
        if(await this.encoderService.checkPassword(password, user.password)){
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
        user.active = true;
        this.usersRepository.saveUserChanges(user);
        this.usersRepository.deleteUserToken(user);
    }

    async requestResetPassword(requestResetPasswordDto :RequestResetPasswordDto): Promise<void>{
        const { email } = requestResetPasswordDto;
        const user: User = await this.usersRepository.findOneByEmail(email);
        const token = await this.encoderService.generateToken();
        this.usersRepository.saveResetPasswordToken(user, token);
        //todo Send email (Lanzar un evento con un listener en un Mail module para lanzar el E-Mail)
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>{
        const { password, resetPasswordToken } = resetPasswordDto
        const user: User = await this.usersRepository.finOneByResetPasswordToken(resetPasswordToken)

        user.password = await this.encoderService.encodePassword(password);
        this.usersRepository.saveUserChanges(user);
        this.usersRepository.deleteResetPasswordToken(user);
    }

}
