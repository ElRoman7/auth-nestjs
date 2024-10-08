import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailModule } from 'src/mail/mail.module';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({  
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    forwardRef(()=> AuthModule)
  ],
  controllers: [UsersController],
  providers:[
    UsersService,
    UsersRepository
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {

}
