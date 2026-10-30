import { PartialType } from '@nestjs/swagger';
import { CreateLanguageDto } from './create.dto';

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {}
