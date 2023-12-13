import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './blog.controller';
import { Blog, BlogSchema } from './blog.model';
import { BlogRepository } from './blog.repository';
import { BlogService } from './blog.service';
import { DatabaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './apps/blogs/.env',
        }),
        MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }],)
    ],
    exports: [BlogService],
    providers: [
        BlogRepository,
        BlogService],
    controllers: [BlogController]
})
export class BlogModule { }
