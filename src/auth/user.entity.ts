// user.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 40})
    name: string;

    @Column({length: 100, unique: true})
    email: string;

    @Column({length: 100})
    password: string;

    @Column({type: 'boolean', default: false})
    active: boolean;

    @Column({ type:'uuid', unique: true, name: 'activation_token', nullable: true })
    activationToken: string;

    @Column({ type:'uuid', unique: true, name: 'resetPassword_token', nullable: true })
    resetPasswordToken: string;

    @CreateDateColumn({ name: 'created_on' })
    createdOn: Date;
}
