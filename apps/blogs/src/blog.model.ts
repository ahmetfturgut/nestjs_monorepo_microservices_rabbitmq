import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MongooseTypes } from 'mongoose'; 
import { BlogStateEnums } from './enums/state.enum';
import { BaseModel } from '@app/common';

export type BlogDocument = Blog & Document;

@Schema()
export class Blog extends BaseModel {

    @Prop()
    title: string;

    @Prop()
    content: string;

    @Prop()
    blogImage: string;

    @Prop({ default: [] })
    likes: string[]; 

    @Prop({ type: String, enum: [BlogStateEnums] })
    state: BlogStateEnums;

}
export const BlogSchema = SchemaFactory.createForClass(Blog);


