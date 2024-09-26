import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity'; // Ajusta el path según tu estructura
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './user.repository';
import { JwtPayload } from './jwt.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService, // Inyectamos el ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header Authorization
      secretOrKey: configService.get<string>('JWT_SECRET'), // Tomamos el secreto del .env
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = this.usersRepository.findOneByEmail(email)
    if(!user){
        throw new UnauthorizedException();
    }
    return user;
  }
}
