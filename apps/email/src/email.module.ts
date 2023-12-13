import { Module } from '@nestjs/common'; 
import { EmailService } from './email.service';  
import { join } from 'path'; 
import { mailConfig } from '@app/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: mailConfig.mailHost,
                port: mailConfig.mailPort,
                secure: true,
                auth: {
                    user: mailConfig.mailUser,
                    pass: mailConfig.mailPassword,
                },
            },
            defaults: {
                from: '"No Reply" <no-reply@localhost>',
            }, 
            preview: true,
            template: { 
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }