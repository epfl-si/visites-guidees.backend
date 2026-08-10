import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';
import { AzureAdModule } from '../auth/azure-ad.module';

@Module({
  imports: [AzureAdModule],
  controllers: [ReservationController],
  providers: [ReservationService, PrismaService],
})
export class ReservationModule {}
