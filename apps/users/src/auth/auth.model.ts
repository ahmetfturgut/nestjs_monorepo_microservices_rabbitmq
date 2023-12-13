import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types as MongooseTypes } from 'mongoose';
import { AuthState } from './enums/auth.state';
import { AuthType } from './enums/auth.type';
import { BaseModel, createSchema } from '@app/common';
import { User } from '../user.model';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth extends BaseModel {

    @Prop({ type: MongooseTypes.ObjectId, ref: 'User' })
    userId: User["id"];

    @Prop({ type: MongooseTypes.ObjectId, ref: 'User' })
    user: User;

    @Prop({ type: String, default: AuthState.PASSIVE })
    state: AuthState;

    @Prop({ type: String, required: true })
    type: AuthType;

    @Prop()
    signInDate: Date;

    @Prop()
    signOutDate: Date;

    @Prop()
    lastRequestDate: Date;

    @Prop()
    expiresIn: Date;

    @Prop()
    token: string;

    @Prop()
    verificationCode: string;

    @Prop({ default: 0 })
    invalidTokenCount: number;

}

export const AuthSchema = createSchema(Auth);

 