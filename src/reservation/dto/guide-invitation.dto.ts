import { ApiProperty } from '@nestjs/swagger';
import { ReservationGuideStatus } from '../../../generated/prisma/client';

class InvitationLanguageDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;
}

class InvitationPlaceDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    description: 'Title keyed by language code',
  })
  title!: Record<string, string>;
}

class InvitationReservationDto {
  @ApiProperty()
  date!: Date;

  @ApiProperty()
  participantNumber!: number;

  @ApiProperty({ nullable: true })
  comment!: string | null;

  @ApiProperty({ type: InvitationLanguageDto })
  language!: InvitationLanguageDto;

  @ApiProperty({ type: InvitationPlaceDto })
  place!: InvitationPlaceDto;
}

export class GuideInvitationDto {
  @ApiProperty()
  reservationId!: number;

  @ApiProperty({ enum: ReservationGuideStatus })
  status!: ReservationGuideStatus;

  @ApiProperty({ type: InvitationReservationDto })
  reservation!: InvitationReservationDto;
}
