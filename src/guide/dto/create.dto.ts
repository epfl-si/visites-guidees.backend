import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CreateGuideDto {
  @ApiProperty()
  @IsNumber()
  sciper!: number;
}

export class CreateBlockedPeriodGuide {
  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  start!: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  end!: Date;
}
