import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsISO8601, Matches, IsNumber } from 'class-validator';
import { IsNotBeforeToday } from '../../common/validators/is-not-before-today.validator';

const UTC_ISO = /Z$/;
const UTC_ISO_MESSAGE =
  '$property must be a UTC ISO 8601 date ending with Z (use toISOString())';
export class CreateGuideDto {
  @ApiProperty()
  @IsNumber()
  sciper!: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  languageIds!: number[];

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  placeIds!: number[];

  @ApiProperty({ example: '2026-05-10T15:00:00.000Z' })
  @IsISO8601({ strict: true })
  @Matches(UTC_ISO, { message: UTC_ISO_MESSAGE })
  @IsNotBeforeToday()
  startDate!: string;
}
