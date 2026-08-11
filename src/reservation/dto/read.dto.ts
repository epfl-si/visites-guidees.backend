import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { ListReservationDto } from './list.dto';

export class ReadReservationDto extends ListReservationDto {
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
