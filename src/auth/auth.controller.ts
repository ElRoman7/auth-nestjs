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


    @Post('/login')
    login(@Body() loginDto: LoginDTO):Promise<{ accessToken: string }>{
        return this.authService.login(loginDto)
    }

    @Patch('request-reset-password')
    requestResetPassword(@Body() requestResetPasswordDto: RequestResetPasswordDto): Promise<void>{
        return this.authService.requestResetPassword(requestResetPasswordDto);
    }

    @Patch('reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void>{
        return this.authService.resetPassword(resetPasswordDto);
    }



}
