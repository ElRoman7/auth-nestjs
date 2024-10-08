import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/users/user.entity';
import { ConfigService } from '@nestjs/config';
import { TitleCasePipe } from './pipes/title-case.pipe';

@Injectable()
export class MailService {
  
  private baseUrl : string;
  private frontUrl : string;
  private titleCasePipe = new TitleCasePipe(); // Crea una instancia del pipe
  
  constructor(private mailerService: MailerService, private readonly configService: ConfigService,) {
    this.baseUrl = this.configService.get<string>('BASE_URL');
    this.frontUrl = this.configService.get<string>('FRONTEND_URL');
  }

  async sendUserConfirmation(user:User): Promise<void> {
    const { id, name ,activationToken, email } = user
    const url = `${this.baseUrl}/auth/activate-account?id=${id}&code=${activationToken}`;
    const formattedName = this.titleCasePipe.transform(name)
    return await this.mailerService.sendMail({
      to: email,
      template: './confirmation',
      context:{
        url: url,
        name: formattedName
      }

    })
  }

  async sendUserResetPassword(user:User): Promise<void> {
    const { name, email, resetPasswordToken } = user;
    const url =`${this.frontUrl}/auth/reset-password?token=${resetPasswordToken}`;
    const formattedName = this.titleCasePipe.transform(name)
    return await this.mailerService.sendMail({
      to: email,
      template: './reset-password',
      context:{
        url: url,
        name: formattedName
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
