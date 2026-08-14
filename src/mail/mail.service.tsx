import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { render } from '@react-email/components';
import { VisitGuideEmail } from '@/mail/templates/guideMail';
import { guideNotification } from '@/mail/interfaces/guideNotification.interface';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  sendMail(destination: string, subject: string, message: string) {
    this.mailService.sendMail({
      from: 'visites-guidees@epfl.ch',
      to: destination,
      subject: subject,
      text: message,
    });
  }

  async notifyGuide(ids: number[], data: Omit<guideNotification, 'guide'>) {
    const guides = await this.prisma.guide.findMany({
      where: { id: { in: ids } },
      include: { user: true },
    });

    await Promise.all(
      guides.map(async (guide) => {
        const html = await render(
          <VisitGuideEmail
            data={{
              ...data,
              guide: {
                name: guide.user.firstName,
                lastName: guide.user.lastName,
              },
            }}
          />,
        );

        this.mailService.sendMail({
          from: 'visites-guidees@epfl.ch',
          to: guide.user.email,
          subject: 'Proposition de visite guidée',
          html,
        });
      }),
    );
  }
}
