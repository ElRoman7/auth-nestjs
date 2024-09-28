import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../auth/user-registered.event'; // Asegúrate de que la ruta sea correcta
import { MailService } from './mail.service';
import { User } from '../auth/user.entity'; // Asegúrate de que la ruta sea correcta

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredListener implements IEventHandler<UserRegisteredEvent> {
    constructor(private readonly mailService: MailService) {}

    async handle(event: UserRegisteredEvent): Promise<void> {
        // Llama al servicio de correo con el objeto de usuario completo
        await this.mailService.sendUserConfirmation(event.user);
    }
}