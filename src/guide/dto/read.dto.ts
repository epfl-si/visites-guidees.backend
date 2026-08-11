import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ListGuideDto } from './list.dto';

export class BlockedPeriodDto {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: { en: 'Vacation', fr: 'Vacances' },
  })
  @IsObject()
  label!: Record<string, string>;

  @ApiProperty()
  @IsDate()
  start!: Date;

  @ApiProperty()
  @IsDate()
  end!: Date;

  @ApiProperty()
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @IsDate()
  updatedAt!: Date;
}

export class ReadGuideDto extends ListGuideDto {
  @ApiProperty({ type: [BlockedPeriodDto] })
  @IsArray()
  @ValidateNested({ each: true })
  blockedPeriods!: BlockedPeriodDto[];
}
