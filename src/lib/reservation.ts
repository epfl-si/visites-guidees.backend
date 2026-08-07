import { CreateReservationDto } from "../reservation/dto/create-reservation.dto"
import { Prisma } from "../../generated/prisma/client";

export function mapToReservationCreateInput(
  content: CreateReservationDto,
  visitDate: Date,
): Prisma.reservationsUncheckedCreateInput {
  return {
    firstName: content.firstName,
    lastName: content.lastName,
    company: content.company ?? '',
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
    payment: '',
    statusId: 1,
  };
}