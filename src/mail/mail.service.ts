import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) { }

  sendMail(destination: string, subject: string, message: string) {

    this.mailService.sendMail({
      from: 'visites-guidees@epfl.ch',
      to: destination,
      subject: subject,
      text: message,
    });
  }
}