import {Post, Controller, Req, Body, Logger} from '@nestjs/common';
import {Subscribe} from "./types/subscribe";
import {Unsubscribe} from "./types/unsubscribe";
import {Notification} from "./types/notification";
import {NotificationService} from './notification.service';
import {ConfigService} from "./configuration.service";
let authSecret;

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService, config: ConfigService) {
        authSecret = config.get('AUTH_SECRET');
    }

    @Post()
    notify(@Req() req, @Body()notificationBody:Notification) {
        if(req.get('auth-secret') != authSecret) {
            Logger.log('Missing or incorrect auth-secret header. Rejecting request.');
            return 401;
        }
        return this.notificationService.notify(notificationBody);
    }

    @Post("subscribe")
    subscribe(@Body() subscribe: Subscribe) {
        return this.notificationService.subscribe(subscribe);
    }

    @Post("unsubscribe")
    unsubscribe(@Body() unsubscribe: Unsubscribe) {
        return this.notificationService.unsubscribe(unsubscribe);
    }
}
