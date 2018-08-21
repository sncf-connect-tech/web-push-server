import {prop, Typegoose} from "typegoose";
import {ApiModelProperty} from "@nestjs/swagger";

export class Notification extends Typegoose {
    constructor() {
        super();
    }
    @prop({ required: true })
    @ApiModelProperty()
    title: string;
    @prop({ required: true })
    @ApiModelProperty()
    message: string;
    @prop({ required: true })
    @ApiModelProperty()
    data: any;
    @prop({ required: true })
    @ApiModelProperty()
    appID: string;
    @ApiModelProperty()
    @prop({ required: true })
    usersList: Array<string>;
}