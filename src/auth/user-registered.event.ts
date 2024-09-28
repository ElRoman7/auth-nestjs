import { User } from './user.entity'; // Asegúrate de que la ruta sea correcta

export class UserRegisteredEvent {
    constructor(public readonly user: User) {} // Aquí recibimos el objeto User
}
