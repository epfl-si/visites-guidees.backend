import { PartialType } from '@nestjs/swagger';
import { CreatePlaceDto } from './create.dto';

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) { }