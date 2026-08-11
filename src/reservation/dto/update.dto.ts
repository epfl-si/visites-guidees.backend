import { PartialType, OmitType } from '@nestjs/swagger';
import { ReadReservationDto } from './read.dto';

export class UpdateReservationDto extends PartialType(
  OmitType(ReadReservationDto, ['id', 'createdAt', 'updatedAt'] as const),
) {}
