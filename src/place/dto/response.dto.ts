import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LanguageDto } from '../../language/dto/language.dto';

export class ResponsePlaceDto {
  @ApiProperty()
  id!: number;

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
      fr: 'Une maison à coté de la plage',
    },
  })
  @IsObject()
  description!: Record<string, string>;

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
  @IsObject()
  conditions!: Record<string, string>;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: [LanguageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  languages!: LanguageDto[];
}

export class ResponsePlaceListDto extends OmitType(ResponsePlaceDto, [
  'languages',
] as const) { }