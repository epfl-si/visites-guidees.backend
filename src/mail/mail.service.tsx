import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { render } from '@react-email/components';
import { VisitGuideEmail } from '@/mail/templates/guideMail';
import { guideNotification } from '@/mail/interfaces/guideNotification.interface';
import MediacomValidationMail from '@/mail/templates/mediacomMail';
import { mediacomValidation } from '@/mail/interfaces/mediacomValidation.interface';
import { GuideChosenEmail } from '@/mail/templates/guideChosenMail';
import { guideChosen } from '@/mail/interfaces/guideChosen.interface';
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

  async notifyMediacom(data: mediacomValidation) {
    const html = await render(<MediacomValidationMail data={data} />);

    await this.mailService.sendMail({
      from: 'visites-guidees@epfl.ch',
      to: process.env.MEDIACOM_EMAIL ?? 'visites-guidees@epfl.ch',
      subject: 'Demande de validation de visite guidée',
      html,
    });
  }

  async notifyChosenGuides(ids: number[], data: Omit<guideChosen, 'guide'>) {
    const guides = await this.prisma.guide.findMany({
      where: { id: { in: ids } },
      include: { user: true },
    });

    await Promise.all(
      guides.map(async (guide) => {
        const html = await render(
          <GuideChosenEmail
            data={{
              ...data,
              guide: {
                name: guide.user.firstName,
                lastName: guide.user.lastName,
              },
            }}
          />,
        );

        await this.mailService.sendMail({
          from: 'visites-guidees@epfl.ch',
          to: guide.user.email,
          subject: 'Vous animerez une visite guidée',
          html,
        });
      }),
    );
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
