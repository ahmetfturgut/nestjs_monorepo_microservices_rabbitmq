
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose"; 
import { Blog, BlogDocument } from "./blog.model";
import { Repository } from "@app/common";

@Injectable()
export class BlogRepository extends Repository<Blog, BlogDocument>{

    constructor(@InjectModel(Blog.name) protected readonly mongoModel: Model<BlogDocument>,
    ) {
        super(mongoModel);
    }

    
        

}