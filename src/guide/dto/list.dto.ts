import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GuideStatus } from '../../../generated/prisma/client';
import { LanguageDto } from '../../language/dto/language.dto';

export class GuideUserDto {
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

  @ApiProperty()
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @IsDate()
  updatedAt!: Date;
}

export class ListGuideDto {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty({ enum: GuideStatus })
  @IsEnum(GuideStatus)
  status!: GuideStatus;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  phone!: string[];

  @ApiProperty({ type: [LanguageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  languages!: LanguageDto[];

  @ApiProperty({ type: GuideUserDto })
  @ValidateNested()
  user!: GuideUserDto;
}
