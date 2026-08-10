import { PartialType, OmitType } from '@nestjs/swagger';
import { ResponseReservationDto } from './response.dto';

export class UpdateReservationDto extends PartialType(
  OmitType(ResponseReservationDto, ['id', 'createdAt', 'updatedAt'] as const),
) {}
