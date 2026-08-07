import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [MailerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: {
        host: config.get<string>('MAIL_HOST', 'mail.epfl.ch'),
        port: 587,
        secure: false,
        auth: {
          user: config.get<string>('SERVICE_ACCOUNT_USERNAME'),
          pass: config.get<string>('SERVICE_ACCOUNT_PASSWORD'),
        },
      },
    }),
  }),],
  providers: [MailService],
})
export class MailModule { }
