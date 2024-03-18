import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

const mailDirecrtoryPath = join(process.cwd(), 'apps/auth/src/mail/');


@Module({
    imports: [
      MailerModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: {
            debug: true,
            host: configService.get<string>('MAIL_HOST'),
            port: configService.get<string>('MAIL_PORT'),
            //ignoretls: configService.get<string>('MAIL_IGNORE_TLS'),
            secureConnection: configService.get<string>('MAIL_SECURE_Connection'),
            auth: {
              user: configService.get<string>('MAIL_USER'),
              pass: configService.get<string>('MAIL_PASSWORD'),
            },
         
          },
          defaults: {
            from: `${configService.get<string>('MAIL_FROM')}`,
          },
          
          template: {
            
            dir: join(mailDirecrtoryPath , 'templates'),
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        }),
      }),
    ],
    providers: [MailService],
    exports: [MailService], // export for DI
  })
  export class MailModule {}