import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
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
import { ChangePasswordDto } from '../dto/change-password.dto';
import { MailService } from '../../mail/mail.service';



@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private encoderService: EncoderService,
        private jwtService: JwtService,
        private mailService: MailService
    ){ }

    async registerUser(registerUserDto:RegisterUserDto ): Promise<void> {
        const { name, email, password } = registerUserDto;
        const activationToken = await this.encoderService.generateToken();
        const hashedPassword = await this.encoderService.encodePassword(password);
        
        const user = await this.usersRepository.createUser(name, email, hashedPassword, activationToken);
        await this.sendActivationEmailToUser(user)
    }

    private sendActivationEmailToUser(user:User): Promise<void>{
        return this.mailService.sendUserConfirmation(user);
    }

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

    async activateUser(activateUserDto: ActivateUserDto): Promise<void>{
        const { id, code } = activateUserDto;
        const user : User = await this.usersRepository.findOneInactiveByIdAndActivationToken(id, code);
        // Comprobar que exista el usuario
        if(!user){
            throw new UnprocessableEntityException('User already activated.');
        }

        // Comprobar si el usuario ya está activo
        if (user.active) {
            // Redirigir a la página de éxito si el usuario ya está activo
            throw new UnprocessableEntityException('User already activated.'); // Este mensaje puede ser usado para redirigir en el controlador
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

    async changePassword(changePasswordDto: ChangePasswordDto, user : User): Promise<void>{
        const { oldPassword, newPassword } = changePasswordDto;
        if(await this.encoderService.checkPassword(oldPassword, user.password)){
            user.password = await this.encoderService.encodePassword(newPassword);
            this.usersRepository.saveUserChanges(user)
        } else{
            throw new BadRequestException('Old password does not match');
        }
    }

}
