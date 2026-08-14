import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';
import { AzureAdModule } from '../auth/azure-ad.module';
import { MailModule } from '@/mail/mail.module';
import { GuideModule } from '../guide/guide.module';

@Module({
  imports: [AzureAdModule, MailModule, GuideModule],
  controllers: [ReservationController],
  providers: [ReservationService, PrismaService],
})
export class ReservationModule {}
