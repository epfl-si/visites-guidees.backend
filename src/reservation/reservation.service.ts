import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { places, Prisma } from '../../generated/prisma/client';
import { UnprocessableEntityException } from '@nestjs/common';
import { mapToReservationCreateInput } from '../lib/reservation'
import { CreateReservationDto } from './dto/create-reservation.dto';
import { isAtLeast7BusinessDaysBefore } from '../lib/days';
@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) { }
  private readonly optionalFields = [
    'company',
    'additionnalAddress',
    'comments',
    'region',
  ];

  getToursInfo(): Promise<places[] | null> {
    return this.prisma.places.findMany();
  }

  async createReservationInDB(data: Prisma.reservationsUncheckedCreateInput) {
    return this.prisma.reservations.create({ data });
  }


  async register(content: CreateReservationDto) {
    Object.entries(content).forEach(([key, value]) => {
      if (!this.optionalFields.includes(key)) {
        if (value === undefined || value === null || value === '') {
          throw new BadRequestException(`${key} must be filled.`);
        }
      }
    });

    if (!content.gdprConsent) {
      throw new UnprocessableEntityException('GDPR consent must be accepted.');
    }

    const visitDate: Date =
      typeof content.visitDate === 'number'
        ? new Date(content.visitDate)
        : content.visitDate;

    if (!isAtLeast7BusinessDaysBefore(visitDate)) {
      throw new UnprocessableEntityException(
        'The visit date must be at least 7 business days before.',
      );
    }

    // TODO : Remove mapping to reservationData and pass content directly to createReservationInDB
    const reservationData = mapToReservationCreateInput(
      content,
      visitDate,
    );

    const reservation = await this.createReservationInDB(reservationData);

    // TODO :  Notify the guides

    return reservation;
  }

  async getLastReservations() {
    const lastReservations = await this.prisma.reservations.findMany({
      select: {
        id: true,
        company: true,
        email: true,
        visitDate: true,
        status: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 10,
    });

    return lastReservations;
  }
}
