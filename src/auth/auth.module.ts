import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { EncoderService } from './services/encoder.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { UserRegisteredListener } from 'src/mail/user-registered.listener';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    MailModule,
    forwardRef(()=> UsersModule)
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService, 
    EncoderService, 
    JwtStrategy,
    UserRegisteredListener
  ],
  exports:[
    JwtStrategy,
    PassportModule,
    AuthService,
    EncoderService
  ]
})
export class AuthModule {}
