import {prop, Typegoose} from "typegoose";

export class Subscribe extends Typegoose {
    constructor() {
        super();
    }
    @prop({ required: true })
    endpoint: string;
    @prop({ required: true })
    auth: string;
    @prop({ required: true })
    p256dh: string;
    @prop({ required: true })
    idUser: string;
    @prop({ required: true })
    appID: string;
}