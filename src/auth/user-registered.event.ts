import { User } from "src/users/user.entity";

export class UserRegisteredEvent {
    constructor(public readonly user: User) {} // Aquí recibimos el objeto User
}
