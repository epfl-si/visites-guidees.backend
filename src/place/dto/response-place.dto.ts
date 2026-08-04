import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsObject,
  IsArray,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LanguageDto } from '../../language/dto/language.dto';
import { OmitType } from '@nestjs/swagger';
export class ResponsePlaceDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: { en: 'Beach House', fr: 'Maison de plage' },
  })
  @IsObject()
  title!: Record<string, string>;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  picture!: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      en: 'A House near the beach',
      fr: 'Une maison à coté de la plages',
    },
  })
  @IsObject()
  description!: Record<string, string>;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  maxPerGroup!: number;

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
  @IsObject()
  conditions!: Record<string, string>;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  languages!: LanguageDto[];
}

export class ResponsePlaceWithoutLanguagesDto extends OmitType(
  ResponsePlaceDto,
  ['languages'] as const,
) {}
