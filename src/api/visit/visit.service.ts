import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PrismaClient, places, Prisma } from '../../../generated/prisma/client';
import { placeAndLanguage } from '../../types/Place';
import { NotFoundException, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { form } from '../../types/Form';
import Holidays from 'date-holidays';

@Injectable()
export class VisitService {
  constructor(private prisma: PrismaService) { }
  private readonly optionalFields = ["company", "additionnalAddress", "comments", "region"];
  private readonly holidays = new Holidays('CH', 'VD');

  getToursInfo(): Promise<places[] | null> {
    return this.prisma.places.findMany();
  }

  async getTourDetails(id: number): Promise<placeAndLanguage> {
    const place = await this.prisma.places.findUnique({
      where: { id },
      include: {
        placeLanguages: {
          include: {
            language: true,
          },
        },
      },
    });

    if (!place) {
      throw new NotFoundException(`No place found with id ${id}`);
    }

    const { placeLanguages, ...placeWithoutLanguages } = place;

    const languages = placeLanguages.map((pl) => ({
      id: pl.language.id,
      name: pl.language.name,
    }));

    if (languages.length === 0) {
      throw new InternalServerErrorException(
        `No languages found for place with id ${id}`,
      );
    }

    return {
      ...placeWithoutLanguages,
      Languages: languages,
    };
  }

  isBusinessDay(date: Date): boolean {
    const day = date.getDay();

    // Sunday or Saturday
    if (day === 0 || day === 6) {
      return false;
    }

    return !this.holidays.isHoliday(date);
  }

  isAtLeast7BusinessDaysBefore(
    visitDate: Date | string,
  ): boolean {
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
  async createReservationInDB(data: Prisma.reservationsUncheckedCreateInput) {
    return this.prisma.reservations.create({ data });
  }

  private mapToReservationCreateInput(
    content: form,
    visitDate: Date,
  ): Prisma.reservationsUncheckedCreateInput {
    return {
      firstName: content.firstName,
      lastName: content.lastName,
      company: content.company ?? "",
      email: content.email,
      phone: content.phone,
      address: content.address,
      additionnalAddress: content.additionnalAddress || null,
      city: content.city,
      region: content.region,
      zip: Number(content.zip),
      country: content.country,
      visitDate,
      numberOfParticipant: Number(content.numberOfParticipant),
      languageId: Number(content.languageId),
      placeId: Number(content.placeId),
      comments: content.comments || null,
      payment: "",
      statusId: 1,
    };
  }

  async register(content: form) {
    Object.entries(content).forEach(([key, value]) => {
      if (key === "gdprConsent") return;
      if (!this.optionalFields.includes(key as keyof form)) {
        if (value === undefined || value === null || value === "") {
          throw new BadRequestException(`${key} must be filled.`);
        }
      }
    });

    if (!content.gdprConsent) {
      throw new UnprocessableEntityException("GDPR consent must be accepted.");
    }

    const visitDate: Date =
      typeof content.visitDate === "number" ? new Date(content.visitDate) : content.visitDate;

    if (!this.isAtLeast7BusinessDaysBefore(visitDate)) {
      throw new UnprocessableEntityException(
        "The visit date must be at least 7 business days before.",
      );
    }

    const reservationData = this.mapToReservationCreateInput(content, visitDate);

    const reservation = await this.createReservationInDB(reservationData);

    // Notify the guides

    return reservation;
  }
}