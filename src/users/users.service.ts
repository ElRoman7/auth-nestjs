import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailService } from 'src/mail/mail.service';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { ActivateUserDto } from './dto/activate-user.dto';
import { EncoderService } from 'src/auth/services/encoder.service';

@Injectable()
export class UsersService {

    constructor (private mailService: MailService, private usersRepository: UsersRepository, private encoderService: EncoderService) {}

    private sendActivationEmailToUser(user:User): Promise<void>{
        return this.mailService.sendUserConfirmation(user);
    }

    async registerUser(registerUserDto:RegisterUserDto ): Promise<void> {
        const { name, email, password } = registerUserDto;
        const activationToken = await this.encoderService.generateToken();
        const hashedPassword = await this.encoderService.encodePassword(password);
        
        const user = await this.usersRepository.createUser(name, email, hashedPassword, activationToken);
        await this.sendActivationEmailToUser(user)
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
