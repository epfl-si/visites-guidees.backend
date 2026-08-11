import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
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
  company!: string;

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
  additionnalAddress!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty()
  @IsNumber()
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
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  participantNumber!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  languageId!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  placeId!: number;

  @ApiProperty()
  @IsString()
  comments!: string;

  @ApiProperty()
  @IsBoolean()
  gdprConsent!: boolean;
}
