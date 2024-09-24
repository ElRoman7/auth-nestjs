// user.repository.ts
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class UsersRepository{
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
      ) {}

      async createUser(registerUserDTO: RegisterUserDto): Promise<void>{
        const { name, email, password } = registerUserDTO;
        const user = this.repository.create({name, email, password});
        try {
          await this.repository.save(user)
        } catch (error) {
          if(error.code == "ER_DUP_ENTRY"){
            throw new ConflictException('This email is already registered');
          }
          throw new InternalServerErrorException();
        }

      }
}
