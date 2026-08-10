// reservation.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Reservation as PrismaReservation,
  ReservationStatus,
} from '../../../generated/prisma/client';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
} from 'class-validator';

export class ReservationEntity implements PrismaReservation {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  company!: string | null;

  @ApiProperty()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  additionalAddress!: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  zip!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  region!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  date!: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  participantNumber!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment!: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  payment!: string;

  @ApiProperty()
  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status!: ReservationStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  languageId!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  placeId!: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  updatedAt!: Date;
}
