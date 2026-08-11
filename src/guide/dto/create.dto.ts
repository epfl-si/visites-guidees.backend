import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateGuideDto {
  @ApiProperty()
  @IsNumber()
  sciper!: number;
}
