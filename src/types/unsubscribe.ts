import {prop, Typegoose} from "typegoose";
import {ApiModelProperty} from "@nestjs/swagger";

export class Unsubscribe extends Typegoose {
    constructor() {
        super();
    }
    @prop({ required: true })
    @ApiModelProperty()
    idUser: string;
    @prop({ required: true })
    @ApiModelProperty()
    appID: string;
}