import {prop, Typegoose} from "typegoose";

export class Unsubscribe extends Typegoose {
    constructor() {
        super();
    }
    @prop({ required: true })
    idUser: string;
    @prop({ required: true })
    appID: string;
}