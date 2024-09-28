import { Body, Controller, Get, Patch, Post, Query, Res, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDTO } from './dto/login.dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express'; // Asegúrate de que esta línea esté presente

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){ }

    @Post('/register')
    async register(@Body() registerUserDto: RegisterUserDto): Promise<void>{
       return this.authService.registerUser(registerUserDto) 
    }

    @Post('/login')
    login(@Body() loginDto: LoginDTO):Promise<{ accessToken: string }>{
        return this.authService.login(loginDto)
    }

    @Get('/activate-account')
    async activateAccount(@Query() activateUserDto: ActivateUserDto, @Res() response: Response): Promise<void> {
        try {
            await this.authService.activateUser(activateUserDto);
            return response.redirect('http://localhost:4200/success-activation'); // URL de tu frontend
        } catch (error) {
            if (error instanceof UnprocessableEntityException && error.message === 'User already activated.') {
                return response.redirect('http://localhost:4200/success-activation'); // Redirigir a la misma página de éxito
            }
            throw error; // Lanzar error si no es por activación ya realizada
        }
    }

    @Patch('request-reset-password')
    requestResetPassword(@Body() requestResetPasswordDto: RequestResetPasswordDto): Promise<void>{
        return this.authService.requestResetPassword(requestResetPasswordDto);
    }

    @Patch('reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void>{
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Patch('change-password')
    @UseGuards(AuthGuard())
    changePassword( @Body() changePasswordDto: ChangePasswordDto, @GetUser() user: User ): Promise<void> {
        return this.authService.changePassword(changePasswordDto, user);
    }

}
