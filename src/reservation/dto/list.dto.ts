import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
import { ReservationStatus } from '../../../generated/prisma/client';

export class ListReservationDto {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  company!: string | null;

  @ApiProperty()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsDate()
  date!: Date;

  @ApiProperty({ enum: ReservationStatus })
  @IsEnum(ReservationStatus)
  status!: ReservationStatus;
}
