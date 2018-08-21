import {prop, Typegoose} from "typegoose";

export class Notification extends Typegoose {
    constructor() {
        super();
    }
    @prop({ required: true })
    title: string;
    @prop({ required: true })
    message: string;
    @prop({ required: true })
    data: any;
    @prop({ required: true })
    appID: string;
    @prop({ required: true })
    usersList: Array<string>;
}