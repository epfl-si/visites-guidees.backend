// place.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  places as PrismaPlace,
  placeLanguage,
  reservations,
  blockedPeriodPlace,
} from '../../../generated/prisma/client';

export class PlaceEntity implements PrismaPlace {
  @ApiProperty()
  id!: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: { en: 'Beach House', fr: 'Maison de plage' },
  })
  title: any;

  @ApiProperty()
  picture!: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      en: 'A House near the beach',
      fr: 'Une maison à coté de la plages',
    },
  })
  description: any;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  maxPerGroup!: number;

  @ApiProperty()
  price!: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      en: 'No smoking, MUST have fun',
      fr: 'Interdiction de fumer, fun obligatoire',
    },
  })
  conditions: any;

  @ApiProperty({ type: () => [Object], required: false })
  placeLanguages?: placeLanguage[];

  @ApiProperty({ type: () => [Object], required: false })
  reservations?: reservations[];

  @ApiProperty({ type: () => [Object], required: false })
  blockedPeriodPlaces?: blockedPeriodPlace[];
}
