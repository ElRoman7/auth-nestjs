import { Body, Controller, Get, Patch, Post, Query, Res, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActivateUserDto } from 'src/users/dto/activate-user.dto';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Response } from 'express'

@Controller('users')
export class UsersController {
    constructor(private userService : UsersService) {}

    @Post('/register')
    async register(@Body() registerUserDto: RegisterUserDto): Promise<void>{
       return this.userService.registerUser(registerUserDto) 
    }

    @Get('/activate-account')
    async activateAccount(@Query() activateUserDto: ActivateUserDto, @Res() response: Response): Promise<void> {
        try {
            await this.userService.activateUser(activateUserDto);
            return response.redirect('http://localhost:4200/auth/confirmed-account'); // URL de tu frontend
        } catch (error) {
            if (error instanceof UnprocessableEntityException && error.message === 'User already activated.') {
                return response.redirect('http://localhost:4200/auth/confirmed-account'); // Redirigir a la misma página de éxito
            }
            throw error; // Lanzar error si no es por activación ya realizada
        }
    }

    @Patch('change-password')
    @UseGuards(AuthGuard())
    changePassword( @Body() changePasswordDto: ChangePasswordDto, @GetUser() user: User ): Promise<void> {
        return this.userService.changePassword(changePasswordDto, user);
    }
}
