import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GuideModule } from '@/guide/guide.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
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
    }),
    GuideModule,
  ],
  providers: [MailService, PrismaService],
  exports: [MailService],
})
export class MailModule {}
