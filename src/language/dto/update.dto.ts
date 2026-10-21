import { PartialType } from '@nestjs/swagger';
import { LanguageDto } from './language.dto';

export class UpdateLanguageDto extends PartialType(LanguageDto) {}
