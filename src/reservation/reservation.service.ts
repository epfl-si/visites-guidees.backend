import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '../../generated/prisma/client';
import Holidays from 'date-holidays';
import { CreateReservationDto } from './dto/create.dto';
import { UpdateReservationDto } from './dto/update.dto';
import { ListReservationDto } from './dto/list.dto';
import { ReadReservationDto } from './dto/read.dto';
import { AppLogger as Logger } from '@/logger.service';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);
  private readonly holidays = new Holidays('CH', 'VD');

  constructor(private prisma: PrismaService) {}

  private isAtLeast7BusinessDaysBefore(visitDate: Date | string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visit = new Date(visitDate);
    visit.setHours(0, 0, 0, 0);

    if (today >= visit) {
      return false;
    }

    let businessDays = 0;
    const current = new Date(today);

    while (current < visit && businessDays < 7) {
      current.setDate(current.getDate() + 1);
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;

      if (!isWeekend && !this.holidays.isHoliday(current)) {
        businessDays++;
      }
    }

    return businessDays >= 7;
  }

  async list(
    order: Prisma.SortOrder = Prisma.SortOrder.desc,
    limit?: number,
  ): Promise<ListReservationDto[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { status: { not: 'CANCELLED' } },
      select: {
        id: true,
        company: true,
        email: true,
        date: true,
        status: true,
      },
      orderBy: { createdAt: order },
      ...(limit && { take: limit }),
    });

    if (reservations.length === 0) {
      this.logger.warn('No reservation found');
      throw new NotFoundException('No reservation found');
    }

    this.logger.log(`Listed ${reservations.length} reservation(s)`);
    return reservations;
  }

  async read(id: number): Promise<ReadReservationDto> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      this.logger.warn(`No reservation found with id ${id}`);
      throw new NotFoundException(`No reservation found with id ${id}`);
    }

    this.logger.log(`Read reservation ${id}`);
    return reservation;
  }

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<ReadReservationDto> {
    const { gdprConsent, date, region, ...rest } = createReservationDto;

    if (!gdprConsent) {
      throw new UnprocessableEntityException('GDPR consent must be accepted.');
    }

    const visitDate = new Date(date);

    if (!this.isAtLeast7BusinessDaysBefore(visitDate)) {
      throw new UnprocessableEntityException(
        'The visit date must be at least 7 business days before.',
      );
    }

    const language = await this.prisma.language.findUnique({
      where: { id: rest.languageId },
    });

    if (!language) {
      const message = `No language found with id ${rest.languageId}`;
      this.logger.warn(message);
      throw new NotFoundException(message);
    }

    const place = await this.prisma.place.findUnique({
      where: { id: rest.placeId },
    });

    if (!place) {
      const message = `No place found with id ${rest.placeId}`;
      this.logger.warn(message);
      throw new NotFoundException(message);
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        ...rest,
        region: region ?? '',
        date: visitDate,
        payment: '',
        status: 'WAITINGGUIDE',
      },
    });

    this.logger.log(`Created reservation ${reservation.id}`);
    return reservation;
  }

  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReadReservationDto> {
    try {
      const reservation = await this.prisma.reservation.update({
        where: { id },
        data: updateReservationDto,
      });

      this.logger.log(`Updated reservation ${id}`);
      return reservation;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        this.logger.warn(`No reservation found with id ${id}`);
        throw new NotFoundException(`No reservation found with id ${id}`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.reservation.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
      this.logger.log(`Removed reservation ${id}`);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        this.logger.warn(`No reservation found with id ${id}`);
        throw new NotFoundException(`No reservation found with id ${id}`);
      }
      throw error;
    }
  }
}
