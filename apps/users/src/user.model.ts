import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types as MongooseTypes } from 'mongoose';
import { UserState } from './enum/user.state';
import { BaseModel, UserType, createSchema, generateSalt, hashPaswordBySalt } from '@app/common';


export type UserDocument = User & Document;


@Schema()
export class User extends BaseModel {

    @Prop({ required: true })
    email: string;

    @Prop()
    name: string;

    @Prop()
    surname: string;

    @Prop({ type: String, enum: [UserType.SYSTEM_USER, UserType.USER] })
    type: UserType;

    @Prop({ type: String, enum: [UserState], default: UserState.NOT_VERIFIED })
    state: UserState;

    @Prop()
    password: string;

    @Prop()
    salt: string;

    @Prop()
    lastLoginDate: Date;


}

export const UserSchema = createSchema(User);

UserSchema.pre<UserDocument>('save', async function () {

    var user = this;

    if ((this.isModified(User["password"]) || this.isNew) && (user.password)) {

        const salt = generateSalt();
        const hash = hashPaswordBySalt(user.password, salt);
        user.password = hash;
        user.salt = salt;

    }
    user.audit.updatedDate = new Date();
});


