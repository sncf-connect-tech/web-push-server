import {Injectable, Logger} from '@nestjs/common';
import {Subscribe} from "./types/subscribe";
import {Notification} from "./types/notification";
import {ConfigService} from "./configuration.service";
import {Unsubscribe} from "./types/unsubscribe";

let webPush = require("web-push");
let util = require("util");
let request = require('request-promise-native');

const mongoose = require('mongoose');

let SubscribeModel;
let notifmeHistory;
let notifmeHistoryUrl;
let notifmeHistoryAuth;

@Injectable()
export class NotificationService {
    constructor(config: ConfigService) {
        mongoose.connect(config.get('MONGO_URL'), { useNewUrlParser: true } );
        if (!config.get('VAPID_SUBJECT')) {
            Logger.error('VAPID_SUBJECT environment variable not found.')
        } else if (!config.get('VAPID_PUBLIC_KEY')) {
            Logger.error('VAPID_PUBLIC_KEY environment variable not found.')
        } else if (!config.get('VAPID_PRIVATE_KEY')) {
            Logger.error('VAPID_PRIVATE_KEY environment variable not found.')
        }
        webPush.setVapidDetails(
            config.get('VAPID_SUBJECT'),
            config.get('VAPID_PUBLIC_KEY'),
            config.get('VAPID_PRIVATE_KEY')
        );
        SubscribeModel = new Subscribe().getModelForClass(Subscribe, {existingConnection: mongoose});
        notifmeHistory = config.get('NOTIFME_HISTORY');
        notifmeHistoryUrl = config.get('NOTIFME_HISTORY_URL');
        notifmeHistoryAuth = config.get('NOTIFME_HISTORY_AUTH');
    }

    async subscribe(userSubscription: Subscribe): Promise<string> {
        Logger.log('Register subscription for user', userSubscription.idUser);
        try{
            let u = await SubscribeModel.findOne( userSubscription );
            Logger.log('User in database : ', JSON.stringify(u));
            if(u){
                Logger.log('Existing user');
                u.auth = userSubscription.auth;
                u.endpoint = userSubscription.endpoint;
                u.p256dh = userSubscription.p256dh;
            } else {
                Logger.log('New user');
                u = new SubscribeModel({
                    idUser: userSubscription.idUser,
                    endpoint: userSubscription.endpoint,
                    auth: userSubscription.auth,
                    p256dh: userSubscription.p256dh,
                    appID: userSubscription.appID
                });
            }
            let user = await u.save();
            Logger.log('Add / Update User subscription Ok');
            return 'Save Subscription ok';
        } catch (error) {
            Logger.error(error)
            return 'Error saving subscription';
        }
    }

    async unsubscribe(unsubscribe: Unsubscribe): Promise<string> {
        Logger.log('Unsubscribe user');
        let u = await SubscribeModel.findOne( unsubscribe );
        Logger.log(u);
        if(u){
            SubscribeModel.deleteOne(unsubscribe)
        }
        return 'User unsubscribed';
    }

    notify(notificationBody:Notification): string {
        Logger.log('Send notification for user', JSON.stringify(notificationBody));
        try {
            SubscribeModel.find({'appID': notificationBody.appID,'idUser': {$in: notificationBody.usersList}}).then(list => {
                list.forEach((pushSubscription) => {
                    let payload = JSON.stringify({message : notificationBody.message, title: notificationBody.title, data: notificationBody.data});

                    Logger.log('Push data', pushSubscription);
                    pushSubscription.keys = {
                        p256dh: pushSubscription.p256dh,
                        auth: pushSubscription.auth
                    };

                    webPush.sendNotification(pushSubscription, payload, {}).then((response) =>{
                        Logger.log("Status : "+util.inspect(response.statusCode));
                        Logger.log("Headers : "+JSON.stringify(response.headers));
                        Logger.log("Body : "+JSON.stringify(response.body));
                        if(notifmeHistory){
                            let date = new Date();
                            let options = {
                                method: 'POST',
                                uri: notifmeHistoryUrl+'/api/notifications',
                                headers: {
                                    'authorization': notifmeHistoryAuth
                                },
                                body: {
                                    channel: notificationBody.appID,
                                    datetime: date.toISOString(),
                                    title: notificationBody.title,
                                    text: notificationBody.message,
                                    tags: [notificationBody.appID, pushSubscription.idUser],
                                    user: {
                                        id: pushSubscription.idUser
                                    },
                                    details: notificationBody.data
                                },
                                json: true
                            };
                            request(options)
                                .then(function (parsedBody) {
                                    Logger.log('Notification history ok', parsedBody);
                                })
                                .catch(function (err) {
                                    Logger.log('Notification history fail', err);
                                });
                        }
                    }).catch((error) =>{
                        Logger.log(error);
                        Logger.log("Status : "+util.inspect(error.statusCode));
                        Logger.log("Headers : "+JSON.stringify(error.headers));
                        Logger.log("Body : "+JSON.stringify(error.body));
                    });
                });
            });
        } catch(error){
            Logger.log(error)
        }

        return 'Notification sent';
    }
}
