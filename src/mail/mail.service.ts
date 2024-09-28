import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/auth/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  
  private baseUrl : string;
  
  constructor(private mailerService: MailerService, private readonly configService: ConfigService,) {
    this.baseUrl = this.configService.get<string>('BASE_URL');
  }

  async sendUserConfirmation(user:User): Promise<void> {
    const { id, name ,activationToken, email } = user
    const url = `${this.baseUrl}/auth/activate-account?id=${id}&code=${activationToken}`;
    return await this.mailerService.sendMail({
      to: email,
      template: './confirmation',
      context:{
        url: url,
        name: name
      }

    })
  }

  async sendUserResetPassword(user:User): Promise<void> {
    const { name, email, resetPasswordToken } = user;

    const url =`${this.baseUrl}/reset-password/${resetPasswordToken}`;
    return await this.mailerService.sendMail({
      to: email,
      template: './reset-password',
      context:{
        url: url,
        name: name
      }

    })
  }


  // create(createMailDto: CreateMailDto) {
  //   return 'This action adds a new mail';
  // }

  // findAll() {
  //   return `This action returns all mail`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} mail`;
  // }

  // update(id: number, updateMailDto: UpdateMailDto) {
  //   return `This action updates a #${id} mail`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} mail`;
  // }
}
