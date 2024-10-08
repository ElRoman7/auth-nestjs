import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  imports: [],
  providers:[],
  exports: [],
})
export class UsersModule {

}
