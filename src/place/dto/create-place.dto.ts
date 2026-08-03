import { IsString, IsNumber, IsNotEmpty, IsObject, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: { en: 'Beach House', fr: 'Maison de plage' },
  })
  @IsObject()
  title!: Record<string, any>;

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
  description!: Record<string, any>;

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
  conditions!: Record<string, any>;

  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  languageIds!: number[];
}
