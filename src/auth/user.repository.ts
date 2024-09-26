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

      async createUser(name: string, email: string, password:string, activationToken: string): Promise<void>{
        const user = this.repository.create({name, email, password, activationToken});
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

      async activateUser(user: User): Promise<void>{
        user.active = true;
        this.repository.save(user);
      }

      // Buscar un Usuario inactivo en base a su id y token de activación
      async findOneInactiveByIdAndActivationToken(id: string, code: string): Promise<User>{
        if(!code){
          throw new ConflictException('User is already Active');
        }
        return this.repository.findOne({where:{ id: id, activationToken: code }})
      }

      async deleteUserToken(user: User): Promise<void> {
        try {
          if (user.active) {
              user.activationToken = null;
              await this.repository.save(user);
              // console.log('Token eliminado, status 200');
              return;
          }
          throw new ConflictException('User is not active');
        } catch (error) {
          // console.error('Error al eliminar el token:', error);
          throw new InternalServerErrorException('Error deleting token');
        }
      };
}
