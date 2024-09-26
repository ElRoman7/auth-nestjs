// user.repository.ts
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersRepository{
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
      ) {}

      async createUser(name: string, email: string, password:string): Promise<void>{
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

      async findOneByEmail(email: string): Promise<User>{
        return await this.repository.findOne({ where: { email } })
      }
}
