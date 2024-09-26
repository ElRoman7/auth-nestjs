import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){ }

    @Post('/register')
    register(@Body() registerUserDto: RegisterUserDto): Promise<void>{
       return this.authService.registerUser(registerUserDto) 
    }
    @Post('/login')
    login(@Body() loginDto: LoginDTO):Promise<{ accessToken: string }>{
        return this.authService.login(loginDto)
    }
}
