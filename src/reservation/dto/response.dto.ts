import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsDate,
  IsEnum,
} from 'class-validator';
import { ReservationStatus } from '../../../generated/prisma/client';

export class ResponseReservationDto {
  @ApiProperty()
  @IsNumber()
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
  @IsString()
  @IsOptional()
  company!: string | null;

  @ApiProperty()
  @IsString()
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
  date!: Date;

  @ApiProperty()
  @IsNumber()
  participantNumber!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment!: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  payment!: string;

  @ApiProperty({ enum: ReservationStatus })
  @IsEnum(ReservationStatus)
  status!: ReservationStatus;

  @ApiProperty()
  @IsNumber()
  languageId!: number;

  @ApiProperty()
  @IsNumber()
  placeId!: number;

  @ApiProperty()
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @IsDate()
  updatedAt!: Date;
}
