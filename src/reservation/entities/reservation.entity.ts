// place.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
    reservations as PrismaReservation,
    placeLanguage,
    reservations,
    blockedPeriodPlace,
} from '../../../generated/prisma/client';
import { IsNumber, IsOptional, IsString, IsNotEmpty, IsDate, isNumber } from 'class-validator';

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
    company!: string;

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
    additionnalAddress!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city!: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    zip!: number;

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
    visitDate!: Date;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    numberOfParticipant!: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    comments!: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    payment!: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    statusId!: number;

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

    @ApiProperty({ type: () => [Object], required: false })
    placeLanguages?: placeLanguage[];

}