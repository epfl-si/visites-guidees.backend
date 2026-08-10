import { IsString, IsNumber, IsNotEmpty, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsLocalizedText } from '../../common/validators/is-localized-text.validator';
import type { LocalizedText } from '../../common/types/localized-text.type';

export class CreatePlaceDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: { en: 'Beach House', fr: 'Maison de plage' },
  })
  @IsLocalizedText()
  title!: LocalizedText;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  picture!: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      en: 'A House near the beach',
      fr: 'Une maison à coté de la plage',
    },
  })
  @IsLocalizedText()
  description!: LocalizedText;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  capacity!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      en: 'No smoking, MUST have fun',
      fr: 'Interdiction de fumer, fun obligatoire',
    },
  })
  @IsLocalizedText()
  conditions!: LocalizedText;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  languageIds!: number[];
}
