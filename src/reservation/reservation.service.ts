import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { CreateReservationDto } from './dto/create.dto';
import { UpdateReservationDto } from './dto/update.dto';
import { ListReservationDto } from './dto/list.dto';
import { ReadReservationDto } from './dto/read.dto';
import { AppLogger as Logger } from '@/logger.service';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  constructor(private prisma: PrismaService) {}

  async list(
    order: Prisma.SortOrder = Prisma.SortOrder.desc,
    limit?: number,
  ): Promise<ListReservationDto[]> {
    const reservations = await this.prisma.reservation.findMany({
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
    if (!createReservationDto.gdprConsent) {
      throw new UnprocessableEntityException('GDPR consent must be accepted.');
    }

    const language = await this.prisma.language.findUnique({
      where: { id: createReservationDto.languageId },
    });

    if (!language) {
      const message = `No language found with id ${createReservationDto.languageId}`;
      this.logger.warn(message);
      throw new NotFoundException(message);
    }

    const place = await this.prisma.place.findUnique({
      where: { id: createReservationDto.placeId },
    });

    if (!place) {
      const message = `No place found with id ${createReservationDto.placeId}`;
      this.logger.warn(message);
      throw new NotFoundException(message);
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        firstName: createReservationDto.firstName,
        lastName: createReservationDto.lastName,
        company: createReservationDto.company,
        email: createReservationDto.email,
        phone: createReservationDto.phone,
        address: createReservationDto.address,
        additionalAddress: createReservationDto.additionnalAddress,
        city: createReservationDto.city,
        zip: createReservationDto.zip,
        region: createReservationDto.region ?? '',
        country: createReservationDto.country,
        date: new Date(createReservationDto.date),
        participantNumber: createReservationDto.participantNumber,
        languageId: createReservationDto.languageId,
        placeId: createReservationDto.placeId,
        comment: createReservationDto.comment,
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
      await this.prisma.reservation.delete({ where: { id } });
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
