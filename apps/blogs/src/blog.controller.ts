import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { HttpExceptionFilter } from "@app/common";

@Controller('blog')
@UseFilters(HttpExceptionFilter)
export class BlogController {

    constructor(private blogService: BlogService) { }

}


