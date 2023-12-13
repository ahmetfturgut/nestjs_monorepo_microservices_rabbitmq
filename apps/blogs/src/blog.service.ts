import { Injectable } from "@nestjs/common"; 
import { BlogRepository } from "./blog.repository";
import { Blog, BlogDocument } from "./blog.model";
import { Service } from "@app/common";


@Injectable()
export class BlogService extends Service<Blog, BlogDocument, BlogRepository> {

    constructor( 
        protected repository: BlogRepository
    ) {
        super(repository);
    }

     

}
