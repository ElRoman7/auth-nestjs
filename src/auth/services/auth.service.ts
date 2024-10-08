import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EncoderService } from './encoder.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from '../dto/login.dto';
import { JwtPayload } from '../interfaces/jwt.payload.interface';
import { UsersRepository } from '../../users/users.repository';
import { RequestResetPasswordDto } from '../dto/request-reset-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { MailService } from '../../mail/mail.service';
import { User } from 'src/users/user.entity';



@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private encoderService: EncoderService,
        private jwtService: JwtService,
        private mailService: MailService
    ){ }

    async login(loginDTO: LoginDTO):  Promise<{ accessToken: string }>{
        const { email, password } = loginDTO
        const user: User = await this.usersRepository.findOneByEmail(email);
        if(await this.encoderService.checkPassword(password, user.password)){
            if(user.active){
                const payload : JwtPayload = {id: user.id, email: user.email, active: user.active}
                const accessToken = await this.jwtService.sign(payload);
                return {accessToken};
            }
            throw new UnauthorizedException('Please Confirm your account');
        }
        throw new UnauthorizedException('Please check your credentials');
    }


    async requestResetPassword(requestResetPasswordDto :RequestResetPasswordDto): Promise<void>{
        const { email } = requestResetPasswordDto;
        const user: User = await this.usersRepository.findOneByEmail(email);
        const token = await this.encoderService.generateToken();
        this.usersRepository.saveResetPasswordToken(user, token);
        //todo Send email (Lanzar un evento con un listener en un Mail module para mandar el E-Mail)
        this.sendResetPasswordEmailToUser(user)
    }

    private sendResetPasswordEmailToUser(user: User): Promise<void>{
        return this.mailService.sendUserResetPassword(user);
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>{
        const { password, resetPasswordToken } = resetPasswordDto
        const user: User = await this.usersRepository.finOneByResetPasswordToken(resetPasswordToken)

        user.password = await this.encoderService.encodePassword(password);
        this.usersRepository.saveUserChanges(user);
        this.usersRepository.deleteResetPasswordToken(user);
    }



}
