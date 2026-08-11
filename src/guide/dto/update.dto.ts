import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GuideStatus } from '../../../generated/prisma/client';

export class UpdateGuideDto {
  @ApiProperty({ enum: GuideStatus, required: false })
  @IsOptional()
  @IsEnum(GuideStatus)
  status?: GuideStatus;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phone?: string[];

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  languageIds?: number[];
}
