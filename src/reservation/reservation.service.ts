import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Place, Prisma } from '../../generated/prisma/client';
import { UnprocessableEntityException } from '@nestjs/common';
import Holidays from 'date-holidays';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) { }
  private readonly optionalFields = [
    'company',
    'additionnalAddress',
    'comments',
    'region',
  ];
  private readonly holidays = new Holidays('CH', 'VD');

  getToursInfo(): Promise<Place[] | null> {
    return this.prisma.place.findMany();
  }

  isBusinessDay(date: Date): boolean {
    const day = date.getDay();

    // Sunday or Saturday
    if (day === 0 || day === 6) {
      return false;
    }

    return !this.holidays.isHoliday(date);
  }

  isAtLeast7BusinessDaysBefore(visitDate: Date | string): boolean {
    const today = new Date();
    const visit = new Date(visitDate);

    today.setHours(0, 0, 0, 0);
    visit.setHours(0, 0, 0, 0);

    if (today >= visit) {
      return false;
    }

    let businessDays = 0;
    const current = new Date(today);

    while (current < visit) {
      current.setDate(current.getDate() + 1);

      if (this.isBusinessDay(current)) {
        businessDays++;
      }
    }
    return businessDays >= 7;
  }
  async createReservationInDB(data: Prisma.ReservationUncheckedCreateInput) {
    return this.prisma.reservation.create({ data });
  }

  private mapToReservationCreateInput(
    content: CreateReservationDto,
    date: Date,
  ): Prisma.ReservationUncheckedCreateInput {
    return {
      firstName: content.firstName,
      lastName: content.lastName,
      company: content.company ?? '',
      email: content.email,
      phone: content.phone,
      address: content.address,
      additionalAddress: content.additionnalAddress,
      city: content.city,
      region: content.region,
      zip: content.zip,
      country: content.country,
      date,
      participantNumber: Number(content.numberOfParticipant),
      languageId: Number(content.languageId),
      placeId: Number(content.placeId),
      comment: content.comments || null,
      payment: '',
      status: 'WAITINGGUIDE',
    };
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

    if (!this.isAtLeast7BusinessDaysBefore(visitDate)) {
      throw new UnprocessableEntityException(
        'The visit date must be at least 7 business days before.',
      );
    }
    // TODO : Remove mapping to reservationData and pass content directly to createReservationInDB
    const reservationData = this.mapToReservationCreateInput(
      content,
      visitDate,
    );

    const reservation = await this.createReservationInDB(reservationData);

    // TODO :  Notify the guides

    return reservation;
  }

  async getLastReservations() {
    const lastReservations = await this.prisma.reservation.findMany({
      select: {
        id: true,
        company: true,
        email: true,
        date: true,
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
