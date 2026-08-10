import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GuideStatus } from '../../../generated/prisma/client';
import { LanguageDto } from '../../language/dto/language.dto';

export class ResponseGuideDto {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsString()
  username!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  phone!: string[];

  @ApiProperty({ enum: GuideStatus })
  @IsEnum(GuideStatus)
  status!: GuideStatus;

  @ApiProperty({ type: [LanguageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  languages!: LanguageDto[];
}
