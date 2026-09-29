import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class ValidateReservationDto {
  @ApiProperty({
    type: [Number],
    description:
      'Scipers of the guides running the visit. They must all have ACCEPTED it.',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  guideIds!: number[];
}
