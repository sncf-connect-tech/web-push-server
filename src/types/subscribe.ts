import {prop, Typegoose} from "typegoose";
import {ApiModelProperty} from "@nestjs/swagger";

export class Subscribe extends Typegoose {
    constructor() {
        super();
    }
    @prop({ required: true })
    @ApiModelProperty()
    endpoint: string;
    @prop({ required: true })
    @ApiModelProperty()
    auth: string;
    @prop({ required: true })
    @ApiModelProperty()
    p256dh: string;
    @prop({ required: true })
    @ApiModelProperty()
    idUser: string;
    @prop({ required: true })
    @ApiModelProperty()
    appID: string;
}